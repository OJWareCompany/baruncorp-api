/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import _ from 'lodash'
import { GenerateJobModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/job-modification-history.decorator'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { OrderStatusChangeValidator } from '../../domain/domain-services/order-status-change-validator.domain-service'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { Mailer } from '../../infrastructure/mailer.infrastructure'
import { SendDeliverablesCommand } from './send-deliverables.command'
import { PrismaService } from '../../../database/prisma.service'
import {
  GoogleDriveDeliverablesFolderShareLinkNoExistException,
  GoogleDriveJobFolderNotFoundException,
} from '../../../filesystem/domain/filesystem.error'

@CommandHandler(SendDeliverablesCommand)
export class SendDeliverablesService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly mailer: Mailer,
    private readonly orderStatusChangeValidator: OrderStatusChangeValidator,
    private readonly prismaService: PrismaService,
  ) {}

  @GenerateJobModificationHistory({ invokedFrom: 'self' })
  async execute(command: SendDeliverablesCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)
    const jobFolder = await this.prismaService.googleJobFolder.findFirst({
      where: { jobId: command.jobId },
    })
    if (!jobFolder) throw new GoogleDriveJobFolderNotFoundException()
    if (!jobFolder.deliverablesFolderShareLink) throw new GoogleDriveDeliverablesFolderShareLinkNoExistException()

    const editor = await this.userRepo.findOneByIdOrThrow(command.updatedByUserId)

    await job.sendToClient(editor, this.mailer, jobFolder.deliverablesFolderShareLink, this.orderStatusChangeValidator)
    await this.jobRepository.update(job) // 업데이트 코드가 실행되기전까지 예외처리 되지 않으면 이력 생성해도 무관하다.
  }
}
