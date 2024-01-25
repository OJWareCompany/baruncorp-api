/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { PaymentRepositoryPort } from '../../database/payment.repository.port'
import { PAYMENT_REPOSITORY } from '../../payment.di-token'
import { PaymentEntity } from '../../domain/payment.entity'
import { CreatePaymentCommand } from './create-payment.command'
import { InvoiceNotFoundException } from '../../../invoice/domain/invoice.error'
import { PaymentOverException, UnissuedInvoicePayException, ZeroPaymentException } from '../../domain/payment.error'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PAYMENT_REPOSITORY) private readonly paymentRepo: PaymentRepositoryPort, // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CreatePaymentCommand): Promise<AggregateID> {
    const entity = PaymentEntity.create({
      ...command,
    })

    if (command.amount <= 0) throw new ZeroPaymentException()

    const invoice = await this.prismaService.invoices.findUnique({ where: { id: command.invoiceId } })
    if (!invoice) throw new InvoiceNotFoundException()
    if (invoice.status === 'Unissued') {
      throw new UnissuedInvoicePayException()
    }

    const jobs = await this.prismaService.orderedJobs.findMany({
      where: { invoiceId: invoice.id },
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

    if (total <= totalOfPayment || total < command.amount + totalOfPayment) {
      throw new PaymentOverException()
    }
    //
    await this.paymentRepo.insert(entity)
    return entity.id
  }
}
