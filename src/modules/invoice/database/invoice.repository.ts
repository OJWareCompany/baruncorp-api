import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import { Invoices } from '@prisma/client'
import { Paginated } from '../../../libs/ddd/repository.port'
import { PrismaService } from '../../database/prisma.service'
import { InvoiceNotFoundException } from '../domain/invoice.error'
import { InvoiceEntity } from '../domain/invoice.entity'
import { InvoiceMapper } from '../invoice.mapper'
import { InvoiceRepositoryPort } from './invoice.repository.port'

@Injectable()
export class InvoiceRepository implements InvoiceRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly invoiceMapper: InvoiceMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  find(): Promise<Paginated<InvoiceEntity>> {
    throw new Error('Method not implemented.')
  }

  async insert(entity: InvoiceEntity): Promise<void> {
    const record = this.invoiceMapper.toPersistence(entity)
    await this.prismaService.invoices.create({
      data: {
        ...record,
        dueDate: null,
      },
    })

    await entity.publishEvents(this.eventEmitter)
  }

  async update(entity: InvoiceEntity): Promise<void> {
    const record = this.invoiceMapper.toPersistence(entity)
    await this.prismaService.invoices.update({ where: { id: entity.id }, data: record })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<Invoices>`DELETE FROM invoices WHERE id = ${id}`
  }

  async findOne(id: string): Promise<InvoiceEntity | null> {
    const record = await this.prismaService.invoices.findUnique({ where: { id } })
    return record ? this.invoiceMapper.toDomain(record) : null
  }

  async findOneOrThrow(id: string): Promise<InvoiceEntity> {
    const record = await this.prismaService.invoices.findUnique({ where: { id } })
    if (!record) throw new InvoiceNotFoundException()
    return this.invoiceMapper.toDomain(record)
  }
}
