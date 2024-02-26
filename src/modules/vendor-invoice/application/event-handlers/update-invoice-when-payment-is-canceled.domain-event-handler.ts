/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { VendorPaymentCanceledDomainEvent } from '../../../vendor-payment/domain/events/vendor-payment-canceled.domain-event'
import { VENDOR_PAYMENT_REPOSITORY } from '../../../vendor-payment/vendor-payment.di-token'
import { VendorInvoiceRepositoryPort } from '../../database/vendor-invoice.repository.port'
import { VENDOR_INVOICE_REPOSITORY } from '../../vendor-invoice.di-token'
import { VendorInvoiceCalculator } from '../../domain/domain-services/vendor-invoice-calculator.domain-service'

@Injectable()
export class UpdatedVendorInvoiceWhenVendorPaymentIsCanceledEventHandler {
  constructor(
    @Inject(VENDOR_PAYMENT_REPOSITORY) private readonly ven: VendorInvoiceRepositoryPort,
    @Inject(VENDOR_INVOICE_REPOSITORY) private readonly invoiceRepo: VendorInvoiceRepositoryPort,
    private readonly vendorInvoiceCalculator: VendorInvoiceCalculator,
  ) {}
  @OnEvent(VendorPaymentCanceledDomainEvent.name, { async: true, promisify: true })
  async handle(event: VendorPaymentCanceledDomainEvent) {
    const vendorInvoice = await this.invoiceRepo.findOneOrThrow(event.vendorInvoiceId)
    await vendorInvoice.determinePaymentTotalAndStatus(this.vendorInvoiceCalculator)
    await this.invoiceRepo.update(vendorInvoice)
  }
}
