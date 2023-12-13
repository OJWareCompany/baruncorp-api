import { Injectable } from '@nestjs/common'
import { VendorInvoices } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { VendorInvoiceMapper } from '../vendor-invoice.mapper'
import { VendorInvoiceRepositoryPort } from './vendor-invoice.repository.port'
import { Paginated } from '../../../libs/ddd/repository.port'
import { VendorInvoiceEntity } from '../domain/vendor-invoice.entity'

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
  async insert(entity: VendorInvoiceEntity): Promise<void> {
    const record = this.vendorInvoiceMapper.toPersistence(entity)
    await this.prismaService.vendorInvoices.create({ data: { ...record, dueDate: null } })
  }

  async update(entity: VendorInvoiceEntity): Promise<void> {
    const record = this.vendorInvoiceMapper.toPersistence(entity)
    await this.prismaService.vendorInvoices.update({ where: { id: entity.id }, data: record })
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
}
