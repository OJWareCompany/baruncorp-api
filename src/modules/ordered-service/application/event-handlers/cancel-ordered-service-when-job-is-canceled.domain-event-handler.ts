/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { JobCanceledDomainEvent } from '../../../ordered-job/domain/events/job-canceled.domain-event'
import { JobCanceledAndKeptInvoiceDomainEvent } from '../../../ordered-job/domain/events/job-canceled-and-kept-invoice.domain-event'

@Injectable()
export class CancelOrderedServiceWhenJobIsCanceledDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
  ) {}

  /**
   * 주문 품목을 저장한다.
   */
  @OnEvent([JobCanceledDomainEvent.name, JobCanceledAndKeptInvoiceDomainEvent.name], { async: true, promisify: true })
  async handle(event: JobCanceledDomainEvent | JobCanceledAndKeptInvoiceDomainEvent) {
    const orderedServiceEntities = await this.orderedServiceRepo.findBy('jobId', [event.aggregateId])
    orderedServiceEntities.map((service) => service.cancel(event))

    await this.orderedServiceRepo.update(orderedServiceEntities)
  }
}
