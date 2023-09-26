import { Controller, Get, Body } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Tasks } from '@prisma/client'
import { TaskResponseDto } from '../../dtos/task.response.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { TaskPaginatedResponseDto } from '../../dtos/task.paginated.response.dto'
import { FindTaskPaginatedRequestDto } from './task.paginated.request.dto'
import { FindTaskPaginatedQuery } from './task.paginated.query-handler'

@Controller('tasks')
export class FindTaskPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(@Body() request: FindTaskPaginatedRequestDto): Promise<TaskPaginatedResponseDto> {
    const command = new FindTaskPaginatedQuery(request)

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
