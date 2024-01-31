/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { OrderDeletionValidator } from '../../../ordered-job/domain/domain-services/order-deletion-validator.domain-service'
import { JobDeletedDomainEvent } from '../../../ordered-job/domain/events/job-deleted.domain-event'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { GenerateOrderedScopeModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/ordered-scope-modification-history.decorator'

export class DeleteOrderedServiceWhenJobIsDeletedDomainServiceHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly modificationValidator: OrderModificationValidator,
    private readonly deletionValidator: OrderDeletionValidator,
  ) {}
  @OnEvent(JobDeletedDomainEvent.name, { async: true, promisify: true })
  @GenerateOrderedScopeModificationHistory({ invokedFrom: 'job' })
  async handle(event: JobDeletedDomainEvent) {
    const orderedServices = await this.orderedServiceRepo.findBy('jobId', [event.aggregateId])

    await Promise.all(
      orderedServices.map(async (orderedService) => {
        await orderedService.delete(this.modificationValidator, this.deletionValidator)
      }),
    )

    await this.orderedServiceRepo.delete(orderedServices)
  }
}
