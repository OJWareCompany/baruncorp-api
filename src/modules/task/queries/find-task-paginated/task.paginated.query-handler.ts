import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PositionTasks, Tasks, prerequisiteTasks } from '@prisma/client'
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

  async execute(query: FindTaskPaginatedQuery): Promise<
    Paginated<{
      task: Tasks
      positions: PositionTasks[]
      prerequisiteTasks: prerequisiteTasks[]
    }>
  > {
    const tasks = await this.prismaService.tasks.findMany({
      skip: query.offset,
      take: query.limit,
    })

    const totalCount = await this.prismaService.tasks.count()

    const positions = await this.prismaService.positionTasks.findMany()
    const prerequisiteTasks = await this.prismaService.prerequisiteTasks.findMany()

    return new Paginated<{
      task: Tasks
      positions: PositionTasks[]
      prerequisiteTasks: prerequisiteTasks[]
    }>({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: tasks.map((task) => {
        return {
          task: task,
          positions: positions.filter((position) => position.taskId === task.id),
          prerequisiteTasks: prerequisiteTasks.filter((pre) => pre.taskId === task.id),
        }
      }),
    })
  }
}
