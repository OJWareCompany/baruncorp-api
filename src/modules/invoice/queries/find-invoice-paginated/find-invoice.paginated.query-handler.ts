import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Invoices, OrderedJobs, Organizations, Prisma } from '@prisma/client'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { InvoiceNotFoundException } from '../../domain/invoice.error'
import { InvoiceStatusEnum } from '../../domain/invoice.type'

export class FindInvoicePaginatedQuery extends PaginatedQueryBase {
  readonly organizationName?: string | null
  readonly status?: InvoiceStatusEnum | null
  readonly invoiceDate?: Date | null
  readonly clientOrganizationId?: string | null
  constructor(props: PaginatedParams<FindInvoicePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

export type FindInvoicePaginatedReturnType = Paginated<Invoices & { organization: Organizations; jobs: OrderedJobs[] }>
@QueryHandler(FindInvoicePaginatedQuery)
export class FindInvoicePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly jobMapper: JobMapper) {}

  async execute(query: FindInvoicePaginatedQuery): Promise<FindInvoicePaginatedReturnType> {
    const condition: Prisma.InvoicesWhereInput = {
      ...(query.organizationName && { organizationName: { contains: query.organizationName } }),
      ...(query.status && { status: query.status }),
      ...(query.invoiceDate && { invoiceDate: query.invoiceDate }),
      ...(query.clientOrganizationId && { clientOrganizationId: query.clientOrganizationId }),
    }

    const invoices = await this.prismaService.invoices.findMany({
      where: condition,
      include: {
        organization: true,
        jobs: true,
        invoiceIssueHistories: true,
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
        jobs: invoice.jobs,
      })),
    })
  }
}
