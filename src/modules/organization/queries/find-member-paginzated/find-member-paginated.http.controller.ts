import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { UserPaginatedResopnseDto } from '../../../users/dtos/user-paginated.response.dto'
import { UserResponseDto } from '../../../users/dtos/user.response.dto'
import { FindMemberPaginatedRequestDto } from './find-member-paginated.request.dto'
import { FindMemberPaginatedQuery } from './find-member-paginated.query-handler'

@Controller('organizations')
export class FindMemberPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: 'find members.' })
  @ApiResponse({ status: HttpStatus.OK, type: UserPaginatedResopnseDto })
  @Get(':organizationId/members')
  async get(
    @Param() request: FindMemberPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<UserPaginatedResopnseDto> {
    const query = new FindMemberPaginatedQuery({
      limit: queryParams.limit,
      page: queryParams.page,
      ...request,
    })

    const result: Paginated<UserResponseDto> = await this.queryBus.execute(query)

    return new UserPaginatedResopnseDto({
      ...result,
      items: result.items,
    })
  }
}
