import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Service } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'

export class FindServicePaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindServicePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindServicePaginatedQuery)
export class FindServicePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindServicePaginatedQuery): Promise<Paginated<Service>> {
    const result = await this.prismaService.service.findMany({
      skip: query.offset,
      take: query.limit,
    })
    const totalCount = await this.prismaService.service.count()
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
