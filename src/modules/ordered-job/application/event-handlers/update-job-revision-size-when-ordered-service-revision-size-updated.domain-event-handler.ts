/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { OrderedServiceUpdatedRevisionSizeDomainEvent } from '../../../ordered-service/domain/events/ordered-service-updated-revision-size.domain-event'

export class UpdateJobRevisionSizeWhenOrderedServiceRevisionSizeUpdatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
  ) {}
  @OnEvent(OrderedServiceUpdatedRevisionSizeDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedServiceUpdatedRevisionSizeDomainEvent) {
    const job = await this.jobRepository.findJobOrThrow(event.jobId)
    job.updateRivisionSize()
    await this.jobRepository.update(job)
  }
}
