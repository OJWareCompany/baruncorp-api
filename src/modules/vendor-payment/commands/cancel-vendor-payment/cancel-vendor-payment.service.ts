/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { VendorPaymentRepositoryPort } from '../../database/vendor-payment.repository.port'
import { VendorPaymentNotFoundException } from '../../domain/vendor-payment.error'
import { VENDOR_PAYMENT_REPOSITORY } from '../../vendor-payment.di-token'
import { CancelVendorPaymentCommand } from './cancel-vendor-payment.command'

@CommandHandler(CancelVendorPaymentCommand)
export class CancelVendorPaymentService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(VENDOR_PAYMENT_REPOSITORY)
    private readonly paymentRepo: VendorPaymentRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CancelVendorPaymentCommand): Promise<void> {
    const entity = await this.paymentRepo.findOne(command.vendorPaymentId)
    if (!entity) throw new VendorPaymentNotFoundException()
    entity.cancel()
    await this.paymentRepo.update(entity)
  }
}
