/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { VendorPaymentCreatedDomainEvent } from '../../../vendor-payment/domain/events/vendor-payment-created.domain-event'
import { VendorPaymentRepositoryPort } from '../../../vendor-payment/database/vendor-payment.repository.port'
import { VENDOR_PAYMENT_REPOSITORY } from '../../../vendor-payment/vendor-payment.di-token'
import { VendorInvoiceRepositoryPort } from '../../database/vendor-invoice.repository.port'
import { VENDOR_INVOICE_REPOSITORY } from '../../vendor-invoice.di-token'
import { VendorInvoiceCalculator } from '../../domain/domain-services/vendor-invoice-calculator.domain-service'

@Injectable()
export class VendorPayInvoiceWhenVendorPaymentIsCreatedEventHandler {
  constructor(
    @Inject(VENDOR_INVOICE_REPOSITORY) private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,
    @Inject(VENDOR_PAYMENT_REPOSITORY) private readonly vendorPaymentRepo: VendorPaymentRepositoryPort,
    private readonly vendorInvoiceCalculator: VendorInvoiceCalculator,
  ) {}
  @OnEvent(VendorPaymentCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: VendorPaymentCreatedDomainEvent) {
    const vendorPayment = await this.vendorPaymentRepo.findOne(event.aggregateId)
    if (vendorPayment) {
      const vendorInvoiceId = vendorPayment.getProps().vendorInvoiceId
      if (vendorInvoiceId) {
        const vendorInvoice = await this.vendorInvoiceRepo.findOneOrThrow(vendorInvoiceId)
        await vendorInvoice.determinePaymentTotalAndStatus(this.vendorInvoiceCalculator)
        await this.vendorInvoiceRepo.update(vendorInvoice)
      }
    }
  }
}
