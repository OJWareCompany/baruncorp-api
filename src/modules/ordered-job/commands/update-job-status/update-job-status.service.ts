/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import _ from 'lodash'
import { GenerateJobModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/job-modification-history.decorator'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { OrderStatusChangeValidator } from '../../domain/domain-services/order-status-change-validator.domain-service'
import { OrderModificationValidator } from '../../domain/domain-services/order-modification-validator.domain-service'
import { TotalDurationCalculator } from '../../domain/domain-services/total-duration-calculator.domain-service'
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
    private readonly totalDurationCalculator: TotalDurationCalculator,
  ) {}

  @GenerateJobModificationHistory({ invokedFrom: 'self' })
  async execute(command: UpdateJobStatusCommand): Promise<void> {
    const job = await this.jobRepository.findJobOrThrow(command.jobId)
    const editor = await this.userRepo.findOneByIdOrThrow(command.editorUserId)
    switch (command.status) {
      case JobStatusEnum.Not_Started:
        await job.backToNotStart(
          this.orderStatusChangeValidator,
          this.orderModificationValidator,
          this.totalDurationCalculator,
        )
        break
      case JobStatusEnum.In_Progress:
        await job.start(this.totalDurationCalculator)
        break
      case JobStatusEnum.Completed:
        await job.complete(this.totalDurationCalculator)
        break
      case JobStatusEnum.Canceled:
        await job.cancel()
        break
      case JobStatusEnum.Canceled_Invoice:
        await job.cancelAndKeepInvoice()
        break
      case JobStatusEnum.On_Hold:
        await job.hold(editor)
        break
    }

    await this.jobRepository.update(job)
  }
}
