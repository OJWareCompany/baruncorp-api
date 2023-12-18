import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Positions } from '@prisma/client'
import { FindPositionUnRegisteredUsersRequestDto } from './find-position-unregistered-users.request.dto'
import { FindPositionUnRegisteredUsersQuery } from './find-position-unregistered-users.query-handler'
import { PositionUnregisteredUserResponseDto } from '../../dtos/position-unregistered-user.response.dto'

@Controller('positions')
export class FindPositionUnRegisteredUsersHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':positionId/unregistered-users')
  async get(@Param() request: FindPositionUnRegisteredUsersRequestDto): Promise<PositionUnregisteredUserResponseDto> {
    const command = new FindPositionUnRegisteredUsersQuery(request)

    const result: Positions = await this.queryBus.execute(command)

    return {
      items: [{ userName: 'chris kim', email: 'a@naver.com', position: 'Sr. Designer', userId: 'asdas' }],
    }
  }
}
