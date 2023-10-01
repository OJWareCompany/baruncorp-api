import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Invoices, Organizations } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { JobEntity } from '../../../ordered-job/domain/job.entity'
import { JobMapper } from '../../../ordered-job/job.mapper'

export class FindInvoicePaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindInvoicePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

export type FindInvoidPaginatedReturnType = Paginated<Invoices & { organization: Organizations; jobs: JobEntity[] }>
@QueryHandler(FindInvoicePaginatedQuery)
export class FindInvoicePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly jobMapper: JobMapper) {}

  async execute(query: FindInvoicePaginatedQuery): Promise<FindInvoidPaginatedReturnType> {
    const invoices = await this.prismaService.invoices.findMany({
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
      skip: query.offset,
      take: query.limit,
    })

    if (!invoices) throw new NotFoundException()

    const totalCount = await this.prismaService.invoices.count({})

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: invoices.map((invoice) => ({
        ...invoice,
        jobs: invoice.jobs.map(this.jobMapper.toDomain),
      })),
    })
  }
}
