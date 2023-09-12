/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { OrderedTaskUpdatedDomainEvent } from '../../../ordered-task/domain/events/ordered-task-updated.domain-event'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'

export class UpdateJobWhenTaskIsUpdatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
  ) {}
  @OnEvent(OrderedTaskUpdatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedTaskUpdatedDomainEvent) {
    const job = await this.jobRepository.findJobOrThrow(event.jobId)
    if (job.isOnHold() && event.taskStatus === 'On Hold') return // 이벤트 재귀 방지
    job.updateJobStatusByTask(event.taskStatus)
    await this.jobRepository.update(job)
  }
}
