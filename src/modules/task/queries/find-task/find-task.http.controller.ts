import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Tasks } from '@prisma/client'
import { TaskResponseDto } from '../../dtos/task.response.dto'
import { FindTaskRequestDto } from './find-task.request.dto'
import { FindTaskQuery } from './find-task.query-handler'

@Controller('tasks')
export class FindTaskHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':taskId')
  async get(@Param() request: FindTaskRequestDto): Promise<TaskResponseDto> {
    const command = new FindTaskQuery(request)

    const result: Tasks = await this.queryBus.execute(command)

    return new TaskResponseDto({
      id: result.id,
      name: result.name,
      serviceId: result.serviceId,
    })
  }
}
