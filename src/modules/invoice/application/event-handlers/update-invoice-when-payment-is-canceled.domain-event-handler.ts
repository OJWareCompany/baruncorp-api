/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { InvoiceNotFoundException } from '../../domain/invoice.error'
import { PaymentCanceledDomainEvent } from '../../../payment/domain/events/payment-canceled.domain-event'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'

@Injectable()
export class UpdatedInvoiceWhenPaymentIsCanceledEventHandler {
  constructor(
    private readonly prismaService: PrismaService, // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
  ) {}
  @OnEvent(PaymentCanceledDomainEvent.name, { async: true, promisify: true })
  async handle(event: PaymentCanceledDomainEvent) {
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

    let subtotal = 0
    let total = 0

    await Promise.all(
      jobs.map(async (job) => {
        const eachSubtotal = await this.jobRepo.getSubtotalInvoiceAmount(job.id)
        const eachTotal = await this.jobRepo.getTotalInvoiceAmount(job.id)
        subtotal += eachSubtotal
        total += eachTotal
      }),
    )

    if (total > totalOfPayment) {
      await this.prismaService.invoices.update({
        where: { id: invoice.id },
        data: {
          status: 'Issued',
        },
      })
    } else if (total <= totalOfPayment) {
      await this.prismaService.invoices.update({
        where: { id: invoice.id },
        data: {
          status: 'Paid',
        },
      })
    }
  }
}
