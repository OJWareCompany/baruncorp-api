import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { IntegratedOrderModificationHistory } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'

export class FindIntegratedOrderModificationHistoryPaginatedQuery extends PaginatedQueryBase {
  readonly integratedOrderModificationHistoryId: string
  constructor(props: PaginatedParams<FindIntegratedOrderModificationHistoryPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindIntegratedOrderModificationHistoryPaginatedQuery)
export class FindIntegratedOrderModificationHistoryPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: FindIntegratedOrderModificationHistoryPaginatedQuery,
  ): Promise<Paginated<IntegratedOrderModificationHistory>> {
    const result = await this.prismaService.integratedOrderModificationHistory.findMany({
      skip: query.offset,
      take: query.limit,
    })
    if (!result) throw new NotFoundException()
    const totalCount = await this.prismaService.integratedOrderModificationHistory.count()
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
