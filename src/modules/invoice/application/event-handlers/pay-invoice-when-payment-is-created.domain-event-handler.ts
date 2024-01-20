/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { PaymentCreatedDomainEvent } from '../../../payment/domain/events/payment-created.domain-event'
import { InvoiceNotFoundException } from '../../domain/invoice.error'

@Injectable()
export class PayInvoiceWhenPaymentIsCreatedEventHandler {
  constructor(private readonly prismaService: PrismaService) {} // @ts-ignore
  @OnEvent(PaymentCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: PaymentCreatedDomainEvent) {
    const invoice = await this.prismaService.invoices.findUnique({ where: { id: event.invoiceId } })
    if (!invoice) throw new InvoiceNotFoundException()

    const jobs = await this.prismaService.orderedJobs.findMany({
      where: { invoiceId: invoice.id },
      include: {
        orderedServices: {
          include: {
            service: true,
          },
        },
      },
    })

    const payments = await this.prismaService.payments.findMany({ where: { invoiceId: invoice.id, canceledAt: null } })
    const totalOfPayment = payments.reduce((pre, cur) => pre + Number(cur.amount), 0)

    let total = 0
    jobs.map((job) => {
      job.orderedServices.map(
        (orderedService) => (total += Number((orderedService.priceOverride || orderedService.price) ?? 0)),
      )
    })

    if (total > totalOfPayment) return

    await this.prismaService.invoices.update({
      where: { id: invoice.id },
      data: {
        status: 'Paid',
      },
    })
  }
}
