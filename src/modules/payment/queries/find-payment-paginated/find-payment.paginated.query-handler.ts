import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Payments } from '@prisma/client'
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

@QueryHandler(FindPaymentPaginatedQuery)
export class FindPaymentPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindPaymentPaginatedQuery): Promise<Paginated<Payments>> {
    const result = await this.prismaService.payments.findMany({
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
