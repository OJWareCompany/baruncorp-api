import { Injectable } from '@nestjs/common'
import { Invoices, OrderedJobs } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service'
import { InvoiceMapper } from '../invoice.mapper'
import { InvoiceRepositoryPort } from './invoice.repository.port'
import { Paginated } from '../../../libs/ddd/repository.port'
import { InvoiceEntity } from '../domain/invoice.entity'
import { zonedTimeToUtc } from 'date-fns-tz'
import { endOfMonth, startOfMonth } from 'date-fns'
import { JobStatusEnum } from '../../ordered-job/domain/job.type'
import { OrderedServiceStatusEnum } from '../../ordered-service/domain/ordered-service.type'

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

  async findJobsToInvoice(clientOrganizationId: string, serviceMonth: Date): Promise<OrderedJobs[]> {
    return await this.prismaService.orderedJobs.findMany({
      where: {
        clientOrganizationId: clientOrganizationId,
        createdAt: {
          gte: zonedTimeToUtc(startOfMonth(serviceMonth), 'Etc/UTC'),
          lte: zonedTimeToUtc(endOfMonth(serviceMonth), 'Etc/UTC'), // serviceMonth가 UTC이니까 UTC를 UTC로 바꾸면 그대로.
        },
        jobStatus: { in: [JobStatusEnum.Completed, JobStatusEnum.Canceled] },
        orderedServices: { some: { status: OrderedServiceStatusEnum.Completed } },
        invoice: null,
      },
    })
  }
}
