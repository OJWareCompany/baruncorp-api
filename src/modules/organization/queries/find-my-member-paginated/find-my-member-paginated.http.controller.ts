import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserResponseDto } from '../../../users/dtos/user.response.dto'
import { UserEntity } from '../../../users/domain/user.entity'
import { FindMyMemberPaginatedQuery } from './find-my-member-paginated.query-handler'

@Controller('organizations')
export class FindMyMemberPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: 'find members.' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  @UseGuards(AuthGuard)
  @Get('/members/my')
  async get(@User() user: UserEntity, @Query() queryParams: PaginatedQueryRequestDto): Promise<UserResponseDto[]> {
    const query = new FindMyMemberPaginatedQuery({
      limit: queryParams.limit,
      page: queryParams.page,
      userId: user.id,
    })
    const result = await this.queryBus.execute(query)
    return result
  }
}
