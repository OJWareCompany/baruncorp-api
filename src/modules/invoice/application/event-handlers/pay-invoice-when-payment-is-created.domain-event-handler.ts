/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PaymentCreatedDomainEvent } from '../../../payment/domain/events/payment-created.domain-event'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { InvoiceCalculator } from '../../domain/domain-services/invoice-calculator.domain-service'

@Injectable()
export class PayInvoiceWhenPaymentIsCreatedEventHandler {
  constructor(
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort,
    private readonly invoiceCalculator: InvoiceCalculator,
  ) {}
  @OnEvent(PaymentCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: PaymentCreatedDomainEvent) {
    const invoice = await this.invoiceRepo.findOneOrThrow(event.invoiceId)
    await invoice.determinePaymentTotalAndStatus(this.invoiceCalculator)
    await this.invoiceRepo.update(invoice)
  }
}
