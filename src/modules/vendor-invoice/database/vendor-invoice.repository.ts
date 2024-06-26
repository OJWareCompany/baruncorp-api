import { Injectable } from '@nestjs/common'
import { VendorInvoices } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { VendorInvoiceMapper } from '../vendor-invoice.mapper'
import { VendorInvoiceRepositoryPort } from './vendor-invoice.repository.port'
import { Paginated } from '../../../libs/ddd/repository.port'
import { VendorInvoiceEntity } from '../domain/vendor-invoice.entity'
import { VendorInvoiceNotFoundException } from '../domain/vendor-invoice.error'

@Injectable()
export class VendorInvoiceRepository implements VendorInvoiceRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly vendorInvoiceMapper: VendorInvoiceMapper,
  ) {}

  async find(): Promise<Paginated<VendorInvoiceEntity>> {
    const record = await this.prismaService.vendorInvoices.findMany()
    const totalCount = await this.prismaService.vendorInvoices.count()
    // TODO
    return new Paginated({
      page: 1,
      pageSize: 10,
      totalCount,
      items: record.map(this.vendorInvoiceMapper.toDomain),
    })
  }

  async update(entity: VendorInvoiceEntity): Promise<void> {
    const record = this.vendorInvoiceMapper.toPersistence(entity)
    await this.prismaService.vendorInvoices.update({
      where: { id: entity.id },
      data: { ...record, dueDate: undefined },
    })
  }

  async insert(entity: VendorInvoiceEntity): Promise<void> {
    const record = this.vendorInvoiceMapper.toPersistence(entity)
    await this.prismaService.vendorInvoices.create({ data: { ...record, dueDate: undefined } })
  }

  async updateTotal(entity: VendorInvoiceEntity): Promise<void> {
    const record = this.vendorInvoiceMapper.toPersistence(entity)
    await this.prismaService.vendorInvoices.update({
      where: { id: record.id },
      data: {
        total: record.total,
        subTotal: record.subTotal,
        invoiceTotalDifference: record.invoiceTotalDifference,
        internalTotalBalanceDue: record.internalTotalBalanceDue,
      },
    })
  }

  async delete(id: string): Promise<void> {
    const assignedTasks = await this.prismaService.assignedTasks.findMany({
      where: {
        vendorInvoiceId: id,
      },
    })
    await Promise.all(
      assignedTasks.map(async (record) => {
        await this.prismaService.assignedTasks.update({ where: { id: record.id }, data: { vendorInvoiceId: null } })
      }),
    )
    await this.prismaService.$executeRaw<VendorInvoices>`DELETE FROM vendor_invoices WHERE id = ${id}`
  }

  async findOne(id: string): Promise<VendorInvoiceEntity | null> {
    const record = await this.prismaService.vendorInvoices.findUnique({ where: { id } })
    return record ? this.vendorInvoiceMapper.toDomain(record) : null
  }

  async findOneOrThrow(id: string): Promise<VendorInvoiceEntity> {
    const entity = await this.findOne(id)
    if (!entity) throw new VendorInvoiceNotFoundException()
    return entity
  }
}
