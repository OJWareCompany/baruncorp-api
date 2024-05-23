/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InvoiceNotFoundException } from '../../domain/invoice.error'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { UpdateInvoiceCommand } from './update-invoice.command'

@CommandHandler(UpdateInvoiceCommand)
export class UpdateInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
  ) {}
  async execute(command: UpdateInvoiceCommand): Promise<void> {
    const entity = await this.invoiceRepo.findOne(command.invoiceId)
    if (!entity) throw new InvoiceNotFoundException()
    entity.setInvoiceDate(command.invoiceDate)
    entity.setTerms(command.terms)
    entity.setNote(command.notesToClient)
    await this.invoiceRepo.update(entity)
  }
}
