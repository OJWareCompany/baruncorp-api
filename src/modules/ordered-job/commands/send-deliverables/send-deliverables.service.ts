/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import _ from 'lodash'
import { GenerateJobModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/job-modification-history.decorator'
import { ProjectRepositoryPort } from '../../../project/database/project.repository.port'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { PROJECT_REPOSITORY } from '../../../project/project.di-token'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { PrismaService } from '../../../database/prisma.service'
import { RFIMailer } from '../../../ordered-job-note/infrastructure/mailer.infrastructure'
import {
  GoogleDriveDeliverablesFolderShareLinkNoExistException,
  GoogleDriveJobFolderNotFoundException,
} from '../../../filesystem/domain/filesystem.error'
import { MakeDeliverablesEmailContents } from '../../domain/domain-services/make-deliverables-email-contents.domain-service'
import { OrderStatusChangeValidator } from '../../domain/domain-services/order-status-change-validator.domain-service'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { SendDeliverablesCommand } from './send-deliverables.command'
import { TrackingNumbersResponseDto } from '../../../tracking-numbers/dtos/tracking-numbers.response.dto'
import { FilesystemApiService } from '@src/modules/filesystem/infra/filesystem.api.service'
import { FilesystemDomainService } from '@src/modules/filesystem/domain/domain-service/filesystem.domain-service'

@CommandHandler(SendDeliverablesCommand)
export class SendDeliverablesService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepositoryPort, // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly orderStatusChangeValidator: OrderStatusChangeValidator,
    private readonly makeDeliverablesEmailContents: MakeDeliverablesEmailContents,
    private readonly mailer: RFIMailer,
    private readonly prismaService: PrismaService,
    private readonly filesystemApiService: FilesystemApiService,
    private readonly filesystemDomainService: FilesystemDomainService,
  ) {}

  @GenerateJobModificationHistory({ invokedFrom: 'self' })
  async execute(command: SendDeliverablesCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)
    const project = await this.projectRepo.findOneOrThrow({ id: job.projectId })
    const jobFolder = await this.prismaService.googleJobFolder.findFirst({
      where: { jobId: command.jobId },
    })
    if (!jobFolder) throw new GoogleDriveJobFolderNotFoundException()
    if (!jobFolder.deliverablesFolderShareLink) throw new GoogleDriveDeliverablesFolderShareLinkNoExistException()

    const records = await this.prismaService.trackingNumbers.findMany({
      where: { jobId: job.id },
      include: {
        user: {
          select: {
            full_name: true,
          },
        },
        job: {
          select: {
            jobName: true,
          },
        },
        courier: {
          select: {
            name: true,
            trackingUrlParam: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const trackings = records.map((record) => {
      const dto: TrackingNumbersResponseDto = {
        id: record.id,
        jobId: record.jobId,
        jobName: record.job.jobName,
        trackingNumberUri: `${record.courier.trackingUrlParam}${record.trackingNumber}`,
        courierId: record.courierId,
        courierName: record.courier.name,
        createdBy: record.user.full_name,
        trackingNumber: record.trackingNumber,
        createdAt: record.createdAt,
      }
      return dto
    })

    const editor = await this.userRepo.findOneByIdOrThrow(command.editorUserId)
    const emailContents = this.makeDeliverablesEmailContents.format(
      project,
      job,
      jobFolder.deliverablesFolderShareLink,
      trackings,
    )
    await job.sendToClient(editor, emailContents, this.mailer, this.orderStatusChangeValidator)

    await this.jobRepository.update(job) // 업데이트 코드가 실행되기전까지 예외처리 되지 않으면 이력 생성해도 무관하다.

    /**
     * @FilesystemLogic
     * - job.sentToClient(...) 로직을 통해서 job 상태가 변경됨
     * - jobRepository.update 로직을 통해서 job 상태가 실제로 sentToClient로 변경됨
     * - job 상태 변경 내용이 DB에 반영되야 실제로 상태가 변경됐다고 생각하고 아래 코드 수행
     *
     * await 하지 않는 이유
     *   - API 요청으로 인해 구글 드라이브의 JobFolder 내의 파일 및 폴더 개수를 카운팅 하는 로직이 수행되는데 이때 시간이 꽤나 걸릴 수 있음
     *   - 그러므로 파일 서버로의 API 요청은 await 하지 말고 then, catch 절로 처리 하자
     */
    const jobFolderId = jobFolder.id
    const sharedDriveId = jobFolder.sharedDriveId

    if (!sharedDriveId) return

    this.filesystemApiService
      .requestToPostCountJobFolder(sharedDriveId, jobFolderId)
      .then(async (data) => {
        await this.filesystemDomainService.reflectGoogleJobFolderCountingResult({
          jobFolderId,
          sharedDriveId,
          count: data.count,
        })
      })
      .catch(async (error) => {
        console.error(error)
        await this.filesystemDomainService.reflectGoogleJobFolderCountingError({
          jobFolderId,
          sharedDriveId,
        })
      })
  }
}
