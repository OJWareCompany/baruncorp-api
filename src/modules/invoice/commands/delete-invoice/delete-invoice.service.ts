/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { InvoiceNotFoundException } from '../../domain/invoice.error'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { DeleteInvoiceCommand } from './delete-invoice.command'

@CommandHandler(DeleteInvoiceCommand)
export class DeleteInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: DeleteInvoiceCommand): Promise<void> {
    const entity = await this.invoiceRepo.findOne(command.invoiceId)
    if (!entity) throw new InvoiceNotFoundException()
    await this.invoiceRepo.delete(entity.id)
  }
}
