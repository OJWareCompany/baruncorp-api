import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PositionTasks, Positions, UserPosition } from '@prisma/client'
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

  async execute(query: FindPositionPaginatedQuery): Promise<
    Paginated<{
      position: Positions
      tasks: PositionTasks[]
    }>
  > {
    const result = await this.prismaService.positions.findMany({
      skip: query.offset,
      take: query.limit,
    })
    if (!result) throw new NotFoundException()

    const tasks = await this.prismaService.positionTasks.findMany({
      where: { positionId: { in: result.map((position) => position.id) } },
    })

    const totalCount = await this.prismaService.positions.count()
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result.map((position) => {
        return {
          position,
          tasks: tasks.filter((task) => task.positionId === position.id),
        }
      }),
    })
  }
}
