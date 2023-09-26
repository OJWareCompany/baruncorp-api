import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Tasks } from '@prisma/client'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'

export class FindTaskPaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindTaskPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindTaskPaginatedQuery)
export class FindTaskPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindTaskPaginatedQuery): Promise<Paginated<Tasks>> {
    const result = await this.prismaService.tasks.findMany({
      skip: query.offset,
      take: query.limit,
    })

    const totalCount = await this.prismaService.tasks.count()

    return new Paginated<Tasks>({
      items: result,
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
    })
  }
}
