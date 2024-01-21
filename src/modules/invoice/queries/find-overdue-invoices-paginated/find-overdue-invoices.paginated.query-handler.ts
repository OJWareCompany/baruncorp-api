import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Invoices, Organizations, Prisma } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { JobEntity } from '../../../ordered-job/domain/job.entity'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { InvoiceNotFoundException } from '../../domain/invoice.error'
import { InvoiceStatusEnum } from '../../domain/invoice.type'

export class FindOverdueInvoicePaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindOverdueInvoicePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

export type FindOverdueInvoicePaginatedReturnType = Paginated<
  Invoices & { organization: Organizations; jobs: JobEntity[] }
>
@QueryHandler(FindOverdueInvoicePaginatedQuery)
export class FindOverdueInvoicePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly jobMapper: JobMapper) {}

  async execute(query: FindOverdueInvoicePaginatedQuery): Promise<FindOverdueInvoicePaginatedReturnType> {
    const condition: Prisma.InvoicesWhereInput = {
      dueDate: { lt: new Date() },
      status: InvoiceStatusEnum.Issued,
    }
    const prerequisiteTasks = await this.prismaService.prerequisiteTasks.findMany()
    const invoices = await this.prismaService.invoices.findMany({
      where: condition,
      include: {
        organization: true,
        jobs: {
          include: {
            orderedServices: {
              include: {
                service: true,
                assignedTasks: {
                  include: {
                    task: true,
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: query.offset,
      take: query.limit,
    })

    if (!invoices) throw new InvoiceNotFoundException()

    const totalCount = await this.prismaService.invoices.count({ where: condition })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: invoices.map((invoice) => ({
        ...invoice,
        jobs: invoice.jobs.map((job) => this.jobMapper.toDomain({ ...job, prerequisiteTasks })),
      })),
    })
  }
}
