import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { FindUserRqeustDto } from './find-user.request.dto'
import { FindUsersQuery } from './find-user.query'
import { UserPaginatedResponseDto } from '../../dtos/user-paginated.response.dto'
import { UserResponseDto } from '../../dtos/user.response.dto'

@Controller('users')
export class FindUsersHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async getFindUsers(
    @Query() dto: FindUserRqeustDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<UserPaginatedResponseDto> {
    const query = new FindUsersQuery({
      page: queryParams.page,
      limit: queryParams.limit,
      email: dto.email,
      organizationId: dto.organizationId,
      organizationName: dto.organizationName,
      isContractor: dto.isContractor,
      userName: dto.userName,
      status: dto.status,
    })
    const result: Paginated<UserResponseDto> = await this.queryBus.execute(query)

    return new UserPaginatedResponseDto({
      ...result,
      items: result.items,
    })
  }
}
