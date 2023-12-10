import { Injectable } from '@nestjs/common'
import { Invoices } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { InvoiceMapper } from '../invoice.mapper'
import { InvoiceRepositoryPort } from './invoice.repository.port'
import { Paginated } from '../../../libs/ddd/repository.port'
import { InvoiceEntity } from '../domain/invoice.entity'
import { InvoiceNotFoundException } from '../domain/invoice.error'

@Injectable()
export class InvoiceRepository implements InvoiceRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly invoiceMapper: InvoiceMapper) {}
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
