import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PtoPaginatedResponseDto } from '../../dtos/pto.paginated.response.dto'
import { FindPtoDetailPaginatedRequestDto } from './find-pto-detail.paginated.request.dto'
import { FindPtoDetailPaginatedQuery } from './find-pto-detail.paginated.query-handler'
import { PtoResponseDto } from '../../dtos/pto.response.dto'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { PtoDetailPaginatedResponseDto } from '../../dtos/pto-detail.paginated.response.dto'
import { PtoDetailResponseDto } from '../../dtos/pto-detail.response.dto'

@Controller('ptos')
export class FindPtoDetailPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/detail')
  @UseGuards(AuthGuard)
  async get(
    @Query() request: FindPtoDetailPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<PtoDetailPaginatedResponseDto> {
    const query = new FindPtoDetailPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<PtoDetailResponseDto> = await this.queryBus.execute(query)

    return new PtoDetailPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
