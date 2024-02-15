/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { VendorInvoiceNotFoundException } from '../../domain/vendor-invoice.error'
import { VendorInvoiceRepositoryPort } from '../../database/vendor-invoice.repository.port'
import { VENDOR_INVOICE_REPOSITORY } from '../../vendor-invoice.di-token'
import { UpdateVendorInvoicedTotalCommand } from './update-vendor-invoiced-total.command'

@CommandHandler(UpdateVendorInvoicedTotalCommand)
export class UpdateVendorInvoicedTotalService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(VENDOR_INVOICE_REPOSITORY)
    private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,
  ) {}
  async execute(command: UpdateVendorInvoicedTotalCommand): Promise<void> {
    const entity = await this.vendorInvoiceRepo.findOne(command.vendorInvoiceId)
    if (!entity) throw new VendorInvoiceNotFoundException()
    entity.enterVendorInvoicedTotal(command.total)
    await this.vendorInvoiceRepo.update(entity)
  }
}
