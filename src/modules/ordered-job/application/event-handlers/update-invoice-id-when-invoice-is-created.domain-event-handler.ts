/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { GenerateJobModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/job-modification-history.decorator'
import { InvoiceCreatedDomainEvent } from '../../../invoice/domain/domain-events/invoice-created.domain-event'

export class UpdateInvoiceIdWhenInvoiceIsCreatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
  ) {}
  @OnEvent(InvoiceCreatedDomainEvent.name, { async: true, promisify: true })
  @GenerateJobModificationHistory({ invokedFrom: 'invoice' })
  async handle(event: InvoiceCreatedDomainEvent) {
    const jobs = await this.jobRepo.findJobsToInvoice(event.clientOrganizationId, event.serviceMonth)
    jobs.map((job) => job.invoice(event.aggregateId))
    await this.jobRepo.update(jobs)
  }
}
