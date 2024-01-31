/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { JobNotStartedDomainEvent } from '../../../ordered-job/domain/events/job-not-started.domain-event'
import { Inject } from '@nestjs/common'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { GenerateOrderedScopeModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/ordered-scope-modification-history.decorator'

export class UpdateOrderedServiceToNotStartedWhenJobIsUpdatedToNotStartedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
  ) {}
  @OnEvent(JobNotStartedDomainEvent.name, { promisify: true, async: true })
  @GenerateOrderedScopeModificationHistory({ invokedFrom: 'job' })
  async handle(event: JobNotStartedDomainEvent) {
    const orderedServices = await this.orderedServiceRepo.findBy('jobId', [event.aggregateId])
    orderedServices.map((orderedService) => orderedService.backToNotStarted(event))
    await this.orderedServiceRepo.update(orderedServices)
  }
}
