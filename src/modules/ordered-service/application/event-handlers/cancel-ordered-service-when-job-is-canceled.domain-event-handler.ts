/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { GenerateOrderedScopeModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/ordered-scope-modification-history.decorator'
import { JobCanceledDomainEvent } from '../../../ordered-job/domain/events/job-canceled.domain-event'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'

@Injectable()
export class CancelOrderedServiceWhenJobIsCanceledDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
  ) {}

  /**
   * 주문 품목을 저장한다.
   */
  @OnEvent(JobCanceledDomainEvent.name, { async: true, promisify: true })
  @GenerateOrderedScopeModificationHistory({ invokedFrom: 'job' })
  async handle(event: JobCanceledDomainEvent) {
    const orderedServiceEntities = await this.orderedServiceRepo.findBy({ jobId: event.aggregateId })
    orderedServiceEntities.map((service) => service.cancel(event))

    await this.orderedServiceRepo.update(orderedServiceEntities)
  }
}
