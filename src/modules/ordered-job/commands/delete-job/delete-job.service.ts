/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { DeleteJobCommand } from './delete-job.command'
import { OrderDeletionValidator } from '../../domain/domain-services/order-deletion-validator.domain-service'
import { OrderModificationValidator } from '../../domain/domain-services/order-modification-validator.domain-service'

@CommandHandler(DeleteJobCommand)
export class DeleteJobService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
    private readonly orderDeletionValidator: OrderDeletionValidator,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}
  async execute(command: DeleteJobCommand): Promise<void> {
    const job = await this.jobRepo.findJobOrThrow(command.id)
    await job.delete(this.orderModificationValidator, this.orderDeletionValidator)
    await this.jobRepo.delete(job)
  }
}
