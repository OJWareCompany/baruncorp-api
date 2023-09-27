/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { AssignedTaskAssignedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-assigned.domain-event'

export class StartJobStatusWhenTaskIsAssignedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
  ) {}
  @OnEvent(AssignedTaskAssignedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskAssignedDomainEvent) {
    const job = await this.jobRepository.findJobOrThrow(event.jobId)
    job.start()
    await this.jobRepository.update(job)
  }
}
