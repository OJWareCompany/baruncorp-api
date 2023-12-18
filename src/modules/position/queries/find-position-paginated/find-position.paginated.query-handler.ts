import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Positions } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'

export class FindPositionPaginatedQuery extends PaginatedQueryBase {
  // readonly positionId: string
  constructor(props: PaginatedParams<FindPositionPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindPositionPaginatedQuery)
export class FindPositionPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindPositionPaginatedQuery): Promise<Paginated<Positions>> {
    const result = await this.prismaService.positions.findMany({
      skip: query.offset,
      take: query.limit,
    })
    if (!result) throw new NotFoundException()
    const totalCount = await this.prismaService.positions.count()
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
