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
  }
}
