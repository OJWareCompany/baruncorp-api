/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import _ from 'lodash'
import { GenerateJobModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/job-modification-history.decorator'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { OrderStatusChangeValidator } from '../../domain/domain-services/order-status-change-validator.domain-service'
import { OrderModificationValidator } from '../../domain/domain-services/order-modification-validator.domain-service'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobStatusEnum } from '../../domain/job.type'
import { UpdateJobStatusCommand } from './update-job-status.command'

@CommandHandler(UpdateJobStatusCommand)
export class UpdateJobStatusService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort, // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort,
    private readonly orderStatusChangeValidator: OrderStatusChangeValidator,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}

  @GenerateJobModificationHistory
  async execute(command: UpdateJobStatusCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)
    const editor = await this.userRepo.findOneByIdOrThrow(command.editorUserId)
    switch (command.status) {
      case JobStatusEnum.Not_Started:
        await job.backToNotStart(this.orderStatusChangeValidator, this.orderModificationValidator)
        break
      case JobStatusEnum.In_Progress:
        job.start()
        break
      case JobStatusEnum.Completed:
        job.complete()
        break
      case JobStatusEnum.Canceled:
        job.cancel()
        break
      case JobStatusEnum.Canceled_Invoice:
        job.cancelAndKeepInvoice()
        break
      case JobStatusEnum.On_Hold:
        job.hold(editor)
        break
    }

    await this.jobRepository.update(job)
  }
}
