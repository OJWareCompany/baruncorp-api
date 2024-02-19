/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { InvoiceCalculator } from '../../domain/domain-services/invoice-calculator.domain-service'
import { CreditTransactionCreatedDomainEvent } from '../../../credit-transaction/domain/domain-events/credit-transaction-created.domain-event'

@Injectable()
export class PayInvoiceWhenCreditPaymentIsCreatedEventHandler {
  constructor(
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort,
    private readonly invoiceCalculator: InvoiceCalculator,
  ) {}
  @OnEvent(CreditTransactionCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: CreditTransactionCreatedDomainEvent) {
    if (event.invoiceId) {
      const invoice = await this.invoiceRepo.findOneOrThrow(event.invoiceId)
      await invoice.determinePaymentTotalAndStatus(this.invoiceCalculator)
      await this.invoiceRepo.update(invoice)
    }
  }
}
