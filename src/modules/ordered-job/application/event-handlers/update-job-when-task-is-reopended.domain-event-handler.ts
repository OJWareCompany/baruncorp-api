/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { AssignedTaskReopenedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-reopened.domain-event'
import { OrderStatusChangeValidator } from '../../domain/domain-services/order-status-change-validator.domain-service'

export class UpdateJobWhenTaskIsReopenedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly orderStatusChangeValidator: OrderStatusChangeValidator,
  ) {}
  @OnEvent(AssignedTaskReopenedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskReopenedDomainEvent) {
    const job = await this.jobRepository.findJobOrThrow(event.jobId)
    const hasCompletedService = !!job.getProps().orderedServices.filter((service) => service.status === 'Completed')
      .length

    if (hasCompletedService) {
      job.start()
    } else {
      job.notStart(this.orderStatusChangeValidator)
    }
    await this.jobRepository.update(job)
  }
}
