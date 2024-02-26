/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { InvoiceCalculator } from '../../domain/domain-services/invoice-calculator.domain-service'
import { CreditTransactionCanceledDomainEvent } from '../../../credit-transaction/domain/domain-events/credit-transaction-canceled.domain-event'
import { CREDIT_TRANSACTION_REPOSITORY } from '../../../credit-transaction/credit-transaction.di-token'
import { CreditTransactionRepositoryPort } from '../../../credit-transaction/database/credit-transaction.repository.port'

@Injectable()
export class UpdatedInvoiceWhenCreditPaymentIsCanceledEventHandler {
  constructor(
    @Inject(CREDIT_TRANSACTION_REPOSITORY) private readonly creditRepo: CreditTransactionRepositoryPort,
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort,
    private readonly invoiceCalculator: InvoiceCalculator,
  ) {}
  @OnEvent(CreditTransactionCanceledDomainEvent.name, { async: true, promisify: true })
  async handle(event: CreditTransactionCanceledDomainEvent) {
    const credit = await this.creditRepo.findOneOrThrow(event.aggregateId)
    const invoiceId = credit.getProps().relatedInvoiceId
    if (invoiceId) {
      const invoice = await this.invoiceRepo.findOneOrThrow(invoiceId)
      await invoice.determinePaymentTotalAndStatus(this.invoiceCalculator)
      await this.invoiceRepo.update(invoice)
    }
  }
}
