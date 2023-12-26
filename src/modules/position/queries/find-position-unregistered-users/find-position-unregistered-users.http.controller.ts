import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Users } from '@prisma/client'
import { PositionUnregisteredUserResponseDto } from '../../dtos/position-unregistered-user.response.dto'
import { FindPositionUnRegisteredUsersRequestDto } from './find-position-unregistered-users.request.dto'
import { FindPositionUnRegisteredUsersQuery } from './find-position-unregistered-users.query-handler'

@Controller('positions')
export class FindPositionUnRegisteredUsersHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':positionId/unregistered-users')
  async get(@Param() request: FindPositionUnRegisteredUsersRequestDto): Promise<PositionUnregisteredUserResponseDto> {
    const command = new FindPositionUnRegisteredUsersQuery(request)

    const result: Users[] = await this.queryBus.execute(command)

    return {
      items: result.map((user) => {
        return {
          userId: user.id,
          email: user.email,
          userName: user.full_name,
        }
      }),
    }
  }
}
