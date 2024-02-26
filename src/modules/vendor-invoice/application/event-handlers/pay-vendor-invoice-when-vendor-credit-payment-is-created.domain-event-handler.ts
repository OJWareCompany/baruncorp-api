/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { VendorCreditTransactionCreatedDomainEvent } from '../../../vendor-credit-transaction/domain/domain-events/vendor-credit-transaction-created.domain-event'
import { VendorInvoiceRepositoryPort } from '../../database/vendor-invoice.repository.port'
import { VENDOR_INVOICE_REPOSITORY } from '../../vendor-invoice.di-token'
import { VendorInvoiceCalculator } from '../../domain/domain-services/vendor-invoice-calculator.domain-service'
import { VENDOR_CREDIT_TRANSACTION_REPOSITORY } from '../../../vendor-credit-transaction/vendor-credit-transaction.di-token'
import { VendorCreditTransactionRepositoryPort } from '../../../vendor-credit-transaction/database/vendor-credit-transaction.repository.port'

@Injectable()
export class PayVendorInvoiceWhenVendorCreditPaymentIsCreatedEventHandler {
  constructor(
    @Inject(VENDOR_INVOICE_REPOSITORY) private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,
    @Inject(VENDOR_CREDIT_TRANSACTION_REPOSITORY)
    private readonly vendorCreditRepo: VendorCreditTransactionRepositoryPort,
    private readonly vendorInvoiceCalculator: VendorInvoiceCalculator,
  ) {}
  @OnEvent(VendorCreditTransactionCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: VendorCreditTransactionCreatedDomainEvent) {
    const vendorCredit = await this.vendorCreditRepo.findOneOrThrow(event.aggregateId)
    const vendorInvoiceId = vendorCredit.getProps().relatedVendorInvoiceId
    if (vendorInvoiceId) {
      const invoice = await this.vendorInvoiceRepo.findOneOrThrow(vendorInvoiceId)
      await invoice.determinePaymentTotalAndStatus(this.vendorInvoiceCalculator)
      await this.vendorInvoiceRepo.update(invoice)
    }
  }
}
