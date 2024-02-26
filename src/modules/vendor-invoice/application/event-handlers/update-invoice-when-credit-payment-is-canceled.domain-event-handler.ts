/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { VendorCreditTransactionCanceledDomainEvent } from '../../../vendor-credit-transaction/domain/domain-events/vendor-credit-transaction-canceled.domain-event'
import { VendorCreditTransactionRepositoryPort } from '../../../vendor-credit-transaction/database/vendor-credit-transaction.repository.port'
import { VENDOR_CREDIT_TRANSACTION_REPOSITORY } from '../../../vendor-credit-transaction/vendor-credit-transaction.di-token'
import { VendorInvoiceRepositoryPort } from '../../database/vendor-invoice.repository.port'
import { VENDOR_INVOICE_REPOSITORY } from '../../vendor-invoice.di-token'
import { VendorInvoiceCalculator } from '../../domain/domain-services/vendor-invoice-calculator.domain-service'

@Injectable()
export class UpdatedVendorInvoiceWhenVendorCreditPaymentIsCanceledEventHandler {
  constructor(
    @Inject(VENDOR_CREDIT_TRANSACTION_REPOSITORY)
    private readonly vendorCreditRepo: VendorCreditTransactionRepositoryPort,
    @Inject(VENDOR_INVOICE_REPOSITORY) private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,
    private readonly vendorInvoiceCalculator: VendorInvoiceCalculator,
  ) {}
  @OnEvent(VendorCreditTransactionCanceledDomainEvent.name, { async: true, promisify: true })
  async handle(event: VendorCreditTransactionCanceledDomainEvent) {
    const vendorCredit = await this.vendorCreditRepo.findOneOrThrow(event.aggregateId)
    const vendorInvoiceId = vendorCredit.getProps().relatedVendorInvoiceId
    if (vendorInvoiceId) {
      const vendorInvoice = await this.vendorInvoiceRepo.findOneOrThrow(vendorInvoiceId)
      await vendorInvoice.determinePaymentTotalAndStatus(this.vendorInvoiceCalculator)
      await this.vendorInvoiceRepo.update(vendorInvoice)
    }
  }
}
