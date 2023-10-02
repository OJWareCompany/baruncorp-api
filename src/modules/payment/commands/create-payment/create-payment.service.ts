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
import { PaymentOverException } from '../../domain/payment.error'

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepo: PaymentRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CreatePaymentCommand): Promise<AggregateID> {
    const entity = PaymentEntity.create({
      ...command,
    })

    //

    const invoice = await this.prismaService.invoices.findUnique({ where: { id: command.invoiceId } })
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

    if (total <= totalOfPayment || total < command.amount + totalOfPayment) {
      throw new PaymentOverException()
    }
    //
    await this.paymentRepo.insert(entity)
    return entity.id
  }
}
