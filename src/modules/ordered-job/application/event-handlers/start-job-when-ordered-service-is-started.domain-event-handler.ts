/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { OrderedServiceStartedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-started.domain-event'

export class StartJobWhenOrderedServiceIsStartedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
  ) {}
  @OnEvent(OrderedServiceStartedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedServiceStartedDomainEvent) {
    const job = await this.jobRepository.findJobOrThrow(event.jobId)
    job.start()
    await this.jobRepository.update(job)
  }
}
