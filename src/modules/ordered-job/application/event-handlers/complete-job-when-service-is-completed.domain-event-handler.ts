/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { OrderedServiceCompletedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-completed.domain-event'

export class CompleteJobWhenServiceIsCompletedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
  ) {}
  @OnEvent(OrderedServiceCompletedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedServiceCompletedDomainEvent) {
    const job = await this.jobRepository.findJobOrThrow(event.jobId)
    job.complete()
    await this.jobRepository.update(job)
  }
}
