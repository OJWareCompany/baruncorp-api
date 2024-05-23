import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import { InvoiceIssueHistory, Invoices } from '@prisma/client'
import { Paginated } from '../../../libs/ddd/repository.port'
import { PrismaService } from '../../database/prisma.service'
import { InvoiceNotFoundException } from '../domain/invoice.error'
import { InvoiceEntity } from '../domain/invoice.entity'
import { InvoiceMapper } from '../invoice.mapper'
import { InvoiceRepositoryPort } from './invoice.repository.port'
import _ from 'lodash'

export type InvoiceModel = Invoices & { invoiceIssueHistories: InvoiceIssueHistory[] }
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
    const { invoiceIssueHistories, ...restOfRecord } = record
    await this.prismaService.invoices.create({
      data: {
        ...restOfRecord,
        dueDate: null,
      },
    })

    await entity.publishEvents(this.eventEmitter)
  }

  async update(entity: InvoiceEntity): Promise<void> {
    const record = this.invoiceMapper.toPersistence(entity)
    const { invoiceIssueHistories, ...restOfRecord } = record
    await this.prismaService.invoices.update({ where: { id: entity.id }, data: restOfRecord })

    if (!invoiceIssueHistories.length) return

    const latestIssuedHistory = invoiceIssueHistories.reduce((latest, item) => {
      return latest.issuedAt > item.issuedAt ? latest : item
    })

    const currentHistory = await this.prismaService.invoiceIssueHistory.findFirst({
      where: { invoiceId: record.id, issuedAt: latestIssuedHistory.issuedAt },
    })

    if (currentHistory) return

    const timeInSeconds = Math.floor(latestIssuedHistory.issuedAt.getTime() / 1000)

    await this.prismaService.invoiceIssueHistory.create({
      data: {
        invoiceId: latestIssuedHistory.invoiceId,
        to: latestIssuedHistory.to,
        cc: latestIssuedHistory.cc,
        issuedAt: new Date(timeInSeconds * 1000),
        issuedByUserId: latestIssuedHistory.issuedByUserId,
        issuedByUserName: latestIssuedHistory.issuedByUserName,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.$executeRaw<Invoices>`DELETE FROM invoices WHERE id = ${id}`
  }

  async findOne(id: string): Promise<InvoiceEntity | null> {
    const record = await this.prismaService.invoices.findUnique({
      where: { id },
      include: { invoiceIssueHistories: true },
    })
    return record ? this.invoiceMapper.toDomain(record) : null
  }

  async findOneOrThrow(id: string): Promise<InvoiceEntity> {
    const record: InvoiceModel | null = await this.prismaService.invoices.findUnique({
      where: { id },
      include: { invoiceIssueHistories: true },
    })
    if (!record) throw new InvoiceNotFoundException()
    return this.invoiceMapper.toDomain(record)
  }
}
