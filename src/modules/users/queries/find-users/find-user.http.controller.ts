import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { UserResponseDto } from '../../dtos/user.response.dto'
import { FindUserRqeustDto } from './find-user.request.dto'
import { FindUsersQuery } from './find-user.query'

@Controller('users')
export class FindUsersHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async getFindUsers(
    @Query() dto: FindUserRqeustDto,
    @Query() searchQuery: PaginatedQueryRequestDto,
  ): Promise<UserResponseDto[]> {
    const query = new FindUsersQuery({
      page: searchQuery.page,
      limit: searchQuery.limit,
      ...dto,
    })
    return await this.queryBus.execute(query)
  }
}
