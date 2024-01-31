/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { JobCanceledAndKeptInvoiceDomainEvent } from '../../../ordered-job/domain/events/job-canceled-and-kept-invoice.domain-event'
import { GenerateOrderedScopeModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/ordered-scope-modification-history.decorator'

@Injectable()
export class CancelOrderedServiceWhenJobIsCanceledAndKeptInvoiceDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
  ) {}

  /**
   * 주문 품목을 저장한다.
   */
  @OnEvent(JobCanceledAndKeptInvoiceDomainEvent.name, { async: true, promisify: true })
  @GenerateOrderedScopeModificationHistory({ invokedFrom: 'job' })
  async handle(event: JobCanceledAndKeptInvoiceDomainEvent) {
    const orderedServiceEntities = await this.orderedServiceRepo.findBy('jobId', [event.aggregateId])
    orderedServiceEntities.map((service) => service.cancel(event))

    await this.orderedServiceRepo.update(orderedServiceEntities)
  }
}
