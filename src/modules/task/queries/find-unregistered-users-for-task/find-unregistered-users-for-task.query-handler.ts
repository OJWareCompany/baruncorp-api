import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Tasks } from '@prisma/client'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'

export class FindUnregisteredUsersForTaskPaginatedQuery extends PaginatedQueryBase {
  readonly taskId: string
  constructor(props: PaginatedParams<FindUnregisteredUsersForTaskPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindUnregisteredUsersForTaskPaginatedQuery)
export class FindUnregisteredUsersForTaskPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindUnregisteredUsersForTaskPaginatedQuery): Promise<Paginated<any>> {
    // const result = await this.prismaService.tasks.findMany({
    //   skip: query.offset,
    //   take: query.limit,
    // })
    // const totalCount = await this.prismaService.tasks.count()
    return new Paginated<Tasks>({
      items: [],
      page: query.page,
      pageSize: query.limit,
      totalCount: 1,
    })
  }
}
