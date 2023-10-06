/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { AssignedTaskReopenedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-reopened.domain-event'

export class UpdateJobWhenTaskIsReopenedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
  ) {}
  @OnEvent(AssignedTaskReopenedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskReopenedDomainEvent) {
    const job = await this.jobRepository.findJobOrThrow(event.jobId)
    const hasCompletedService = !!job.getProps().orderedServices.filter((service) => service.status === 'Completed')
      .length

    if (hasCompletedService) {
      job.start()
    } else {
      job.notStart()
    }
    console.log(hasCompletedService, '?')
    await this.jobRepository.update(job)
  }
}
