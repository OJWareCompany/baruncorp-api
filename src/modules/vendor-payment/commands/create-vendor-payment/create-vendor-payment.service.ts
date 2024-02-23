/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { VendorPaymentRepositoryPort } from '../../database/vendor-payment.repository.port'
import { VENDOR_PAYMENT_REPOSITORY } from '../../vendor-payment.di-token'
import { VendorPaymentEntity } from '../../domain/vendor-payment.entity'
import { CreateVendorPaymentCommand } from './create-vendor-payment.command'
import {
  VendorPaymentOverException,
  ZeroPaymentException,
  VendorPaymentNotFoundException,
} from '../../domain/vendor-payment.error'
import { PaymentMethodEnum } from '../../domain/vendor-payment.type'

@CommandHandler(CreateVendorPaymentCommand)
export class CreateVendorPaymentService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(VENDOR_PAYMENT_REPOSITORY)
    private readonly vendorPaymentRepo: VendorPaymentRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CreateVendorPaymentCommand): Promise<AggregateID> {
    const entity = VendorPaymentEntity.create({
      ...command,
    })

    if (command.amount <= 0) throw new ZeroPaymentException()

    const vendorInvoice = await this.prismaService.vendorInvoices.findUnique({ where: { id: command.vendorInvoiceId } })
    if (!vendorInvoice) throw new VendorPaymentNotFoundException()
    // if (vendorInvoice.status === 'Unissued') {
    //   throw new UnissuedInvoicePayException()
    // }

    const assignedTasks = await this.prismaService.assignedTasks.findMany({
      where: { vendorInvoiceId: vendorInvoice.id },
    })

    const payments = await this.prismaService.vendorPayments.findMany({
      where: { vendorInvoiceId: vendorInvoice.id, canceledAt: null },
    })
    const totalOfPayment = payments.reduce((pre, cur) => pre + Number(cur.amount), 0)

    const total = assignedTasks.reduce((pre, cur) => pre + Number(cur.cost), 0)

    if (total <= totalOfPayment || total < command.amount + totalOfPayment) {
      throw new VendorPaymentOverException()
    }

    await this.vendorPaymentRepo.insert(entity)

    vendorInvoice.transaction_type = PaymentMethodEnum.Direct

    await this.prismaService.vendorInvoices.update({
      where: { id: vendorInvoice.id },
      data: {
        transaction_type: vendorInvoice.transaction_type,
      },
    })

    return entity.id
  }
}
