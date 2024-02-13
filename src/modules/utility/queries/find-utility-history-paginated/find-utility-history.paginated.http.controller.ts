import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UtilityResponseDto } from '../../dtos/utility.response.dto'
import { UtilityPaginatedResponseDto } from '@modules/utility/dtos/utility.paginated.response.dto'
import { FindUtilityHistoryPaginatedQuery } from '@modules/utility/queries/find-utility-history-paginated/find-utility-history.paginated.query-handler'
import { UtilityHistoryPaginatedResponseDto } from '@modules/utility/dtos/utility-history.paginated.response.dto'
import { UtilityHistoryResponseDto } from '@modules/utility/dtos/utility-history.response.dto'
import { FindUtilityRequestDto } from '@modules/utility/queries/find-utility/find-utility.request.dto'
import { FindUtilityHistoryPaginatedParamRequestDto } from '@modules/utility/queries/find-utility-history-paginated/find-utility-history.paginated.request.dto'

@Controller('utilities')
export class FindUtilityHistoryPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':utilityId/histories')
  @UseGuards(AuthGuard)
  async get(
    @Param() param: FindUtilityHistoryPaginatedParamRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<UtilityHistoryPaginatedResponseDto> {
    const query: FindUtilityHistoryPaginatedQuery = new FindUtilityHistoryPaginatedQuery({
      utilityId: param.utilityId,
      ...queryParams,
    })

    const result: Paginated<UtilityHistoryResponseDto> = await this.queryBus.execute(query)

    return new UtilityHistoryPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
