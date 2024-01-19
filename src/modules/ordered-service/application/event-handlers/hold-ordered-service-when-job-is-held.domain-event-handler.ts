/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { JobHeldDomainEvent } from '../../../ordered-job/domain/events/job-held.domain-event'
import { Inject } from '@nestjs/common'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'

export class HoldOrderedServiceWhenJobIsHeldDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
  ) {}
  @OnEvent(JobHeldDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobHeldDomainEvent) {
    const orderedServices = await this.orderedServiceRepo.findBy('jobId', [event.aggregateId])
    orderedServices.map((orderedService) => orderedService.hold())
    await this.orderedServiceRepo.update(orderedServices)
  }
}
