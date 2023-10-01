/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'
import { InvoiceEntity } from '../../domain/invoice.entity'
import { CreateInvoiceCommand } from './create-invoice.command'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'

@CommandHandler(CreateInvoiceCommand)
export class CreateInvoiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CreateInvoiceCommand): Promise<AggregateID> {
    const entity = InvoiceEntity.create({
      ...command,
    })
    await this.invoiceRepo.insert(entity)
    return entity.id
  }
}
