/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { VendorInvoiceNotFoundException } from '../../domain/vendor-invoice.error'
import { VendorInvoiceRepositoryPort } from '../../database/vendor-invoice.repository.port'
import { VENDOR_INVOICE_REPOSITORY } from '../../vendor-invoice.di-token'
import { UpdateVendorInvoiceCommand } from './update-vendor-invoice.command'
import { VendorInvoiceCalculator } from '../../domain/domain-services/vendor-invoice-calculator.domain-service'

@CommandHandler(UpdateVendorInvoiceCommand)
export class UpdateVendorInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(VENDOR_INVOICE_REPOSITORY)
    private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,
  ) {}
  async execute(command: UpdateVendorInvoiceCommand): Promise<void> {
    const entity = await this.vendorInvoiceRepo.findOne(command.vendorInvoiceId)
    if (!entity) throw new VendorInvoiceNotFoundException()
    entity.setNote(command.note)
    entity.setInvoiceDate(command.invoiceDate, command.terms)
    await this.vendorInvoiceRepo.update(entity)
  }
}
