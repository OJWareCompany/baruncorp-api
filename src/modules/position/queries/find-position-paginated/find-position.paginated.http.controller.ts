import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PositionTasks, Positions } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PositionPaginatedResponseDto } from '../../dtos/position.paginated.response.dto'
import { FindPositionPaginatedRequestDto } from './find-position.paginated.request.dto'
import { FindPositionPaginatedQuery } from './find-position.paginated.query-handler'

@Controller('positions')
export class FindPositionPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindPositionPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<PositionPaginatedResponseDto> {
    const command = new FindPositionPaginatedQuery({
      // ...request,
      ...queryParams,
    })

    const result: Paginated<{ position: Positions; tasks: PositionTasks[] }> = await this.queryBus.execute(command)

    return new PositionPaginatedResponseDto({
      page: result.page,
      pageSize: result.pageSize,
      totalCount: result.totalCount,
      items: result.items.map(({ position, tasks }) => ({
        id: position.id,
        name: position.name,
        maxAssignedTasksLimit: position.maxAssignedTasksLimit,
        description: position.description,
        tasks: tasks.map((task) => {
          return {
            taskId: task.taskId,
            taskName: task.taskName,
            autoAssignmentType: task.autoAssignmentType,
          }
        }),
      })),
    })
  }
}
