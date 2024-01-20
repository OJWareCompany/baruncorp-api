/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { JobStartedDomainEvent } from '../../../ordered-job/domain/events/job-started.domain-event'

export class UpdateOrderedServiceToNotStartedWhenJobIsUpdatedToNotStartedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
  ) {}
  @OnEvent(JobStartedDomainEvent.name, { promisify: true, async: true })
  async handle(event: JobStartedDomainEvent) {
    const orderedServices = await this.orderedServiceRepo.findBy('jobId', [event.aggregateId])
    orderedServices.map((orderedService) => orderedService.backToNotStarted(event))
    await this.orderedServiceRepo.update(orderedServices)
  }
}
