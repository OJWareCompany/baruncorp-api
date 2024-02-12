import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { FindUtilityPaginatedQuery } from './utility.paginated.query-handler'
import { UtilityResponseDto } from '../../dtos/utility.response.dto'
import { FindUtilityPaginatedRequestDto } from './utility.paginated.request.dto'
import { UtilityPaginatedResponseDto } from '@modules/utility/dtos/utility.paginated.response.dto'

@Controller('utilities')
export class FindUtilityPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @UseGuards(AuthGuard)
  async get(
    @Query() request: FindUtilityPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<UtilityPaginatedResponseDto> {
    const query: FindUtilityPaginatedQuery = new FindUtilityPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<UtilityResponseDto> = await this.queryBus.execute(query)

    return new UtilityPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
