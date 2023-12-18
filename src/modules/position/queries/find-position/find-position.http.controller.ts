import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Positions } from '@prisma/client'
import { PositionResponseDto } from '../../dtos/position.response.dto'
import { FindPositionRequestDto } from './find-position.request.dto'
import { FindPositionQuery } from './find-position.query-handler'

@Controller('positions')
export class FindPositionHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':positionId')
  async get(@Param() request: FindPositionRequestDto): Promise<PositionResponseDto> {
    const command = new FindPositionQuery(request)

    const result: Positions = await this.queryBus.execute(command)

    return {
      id: 'sa22-4a33-11ra-3rdw-403a',
      name: 'Sr. Designer',
      maxAssignedTasksLimit: 0,
      description: null,
      tasks: [{ taskId: 'asd', taskName: 'PV Design', autoAssignmentType: 'Commercial' }],
      workers: [{ userId: 'asdf', userName: 'Chris Kim', email: 'chris@baruncorp.com' }],
    }
  }
}
