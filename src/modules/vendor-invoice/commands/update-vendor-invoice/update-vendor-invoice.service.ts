/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { VendorInvoiceRepositoryPort } from '../../database/vendor-invoice.repository.port'
import { VendorInvoiceNotFoundException } from '../../domain/vendor-invoice.error'
import { VENDOR_INVOICE_REPOSITORY } from '../../vendor-invoice.di-token'
import { UpdateVendorInvoiceCommand } from './update-vendor-invoice.command'

@CommandHandler(UpdateVendorInvoiceCommand)
export class UpdateVendorInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(VENDOR_INVOICE_REPOSITORY)
    private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdateVendorInvoiceCommand): Promise<void> {
    const entity = await this.vendorInvoiceRepo.findOne(command.vendorInvoiceId)
    if (!entity) throw new VendorInvoiceNotFoundException()
    await this.vendorInvoiceRepo.update(entity)
  }
}
