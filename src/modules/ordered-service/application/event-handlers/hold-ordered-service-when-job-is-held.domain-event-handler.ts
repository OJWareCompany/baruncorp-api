/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { JobHeldDomainEvent } from '../../../ordered-job/domain/events/job-held.domain-event'
import { Inject } from '@nestjs/common'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { GenerateOrderedScopeModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/ordered-scope-modification-history.decorator'

export class HoldOrderedServiceWhenJobIsHeldDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
  ) {}
  @OnEvent(JobHeldDomainEvent.name, { async: true, promisify: true })
  @GenerateOrderedScopeModificationHistory({ invokedFrom: 'job' })
  async handle(event: JobHeldDomainEvent) {
    const orderedServices = await this.orderedServiceRepo.findBy('jobId', [event.aggregateId])
    orderedServices.map((orderedService) => orderedService.hold())
    await this.orderedServiceRepo.update(orderedServices)
  }
}
