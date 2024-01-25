import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { IntegratedOrderModificationHistory } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { IntegratedOrderModificationHistoryPaginatedResponseDto } from '../../dtos/integrated-order-modification-history.paginated.response.dto'
import { FindIntegratedOrderModificationHistoryPaginatedRequestDto } from './find-integrated-order-modification-history.paginated.request.dto'
import { FindIntegratedOrderModificationHistoryPaginatedQuery } from './find-integrated-order-modification-history.paginated.query-handler'

@Controller('integrated-order-modification-history')
export class FindIntegratedOrderModificationHistoryPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindIntegratedOrderModificationHistoryPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<IntegratedOrderModificationHistoryPaginatedResponseDto> {
    const command = new FindIntegratedOrderModificationHistoryPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<IntegratedOrderModificationHistory> = await this.queryBus.execute(command)

    return new IntegratedOrderModificationHistoryPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: [],
    })
  }
}
