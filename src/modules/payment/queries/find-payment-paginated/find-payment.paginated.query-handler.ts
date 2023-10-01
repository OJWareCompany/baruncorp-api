import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Invoices, Organizations, Payments } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'

export class FindPaymentPaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindPaymentPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

export type FindPaymentPaginatedReturnType = Payments & { invoice: Invoices & { organization: Organizations } }
@QueryHandler(FindPaymentPaginatedQuery)
export class FindPaymentPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindPaymentPaginatedQuery): Promise<Paginated<FindPaymentPaginatedReturnType>> {
    const result = await this.prismaService.payments.findMany({
      include: {
        invoice: {
          include: {
            organization: true,
          },
        },
      },
      skip: query.offset,
      take: query.limit,
    })
    if (!result) throw new NotFoundException()
    const totalCount = await this.prismaService.payments.count()

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
