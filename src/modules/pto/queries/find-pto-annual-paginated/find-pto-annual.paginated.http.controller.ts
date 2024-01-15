import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PtoPaginatedResponseDto } from '../../dtos/pto.paginated.response.dto'
import { FindPtoAnnualPaginatedRequestDto } from './find-pto-annual.paginated.request.dto'
import { FindPtoAnnualPaginatedQuery } from './find-pto-annual.paginated.query-handler'
import { PtoResponseDto } from '../../dtos/pto.response.dto'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { PtoAnnualResponseDto } from '../../dtos/pto-annual.response.dto'
import { PtoAnnualPaginatedResponseDto } from '../../dtos/pto-annual.paginated.response.dto'

@Controller('ptos')
export class FindPtoAnnualPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/annual')
  // @UseGuards(AuthGuard)
  async get(
    @Query() request: FindPtoAnnualPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<PtoAnnualPaginatedResponseDto> {
    const query = new FindPtoAnnualPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<PtoAnnualResponseDto> = await this.queryBus.execute(query)

    return new PtoAnnualPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
