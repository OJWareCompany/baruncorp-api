import { Controller, Get, Body, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Tasks } from '@prisma/client'
import { TaskResponseDto } from '../../dtos/task.response.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { TaskPaginatedResponseDto } from '../../dtos/task.paginated.response.dto'
import { FindTaskPaginatedRequestDto } from './task.paginated.request.dto'
import { FindTaskPaginatedQuery } from './task.paginated.query-handler'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'

@Controller('tasks')
export class FindTaskPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Body() request: FindTaskPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<TaskPaginatedResponseDto> {
    const command = new FindTaskPaginatedQuery({
      ...queryParams,
      ...request,
    })

    const result: Paginated<Tasks> = await this.queryBus.execute(command)

    return new TaskPaginatedResponseDto({
      ...result,
      items: result.items.map((task) => {
        return new TaskResponseDto({
          id: task.id,
          name: task.name,
          serviceId: task.serviceId,
        })
      }),
    })
  }
}
