import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { FindUserRqeustDto } from './find-user.request.dto'
import { UserResponseDto } from '../../dtos/user.response.dto'
import { FindUsersQuery } from './find-user.query'

@Controller('users')
export class FindUsersHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async getFindUsers(@Query() dto: FindUserRqeustDto): Promise<UserResponseDto[]> {
    const query = new FindUsersQuery(dto)
    return await this.queryBus.execute(query)
  }
}
