import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PtoPaginatedResponseDto } from '../../dtos/pto.paginated.response.dto'
import { FindPtoTypePaginatedQuery } from './find-pto-type.paginated.query-handler'
import { PtoResponseDto } from '../../dtos/pto.response.dto'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { PtoAnnualResponseDto } from '../../dtos/pto-annual.response.dto'
import { PtoAnnualPaginatedResponseDto } from '../../dtos/pto-annual.paginated.response.dto'
import { PtoTypePaginatedResponseDto } from '../../dtos/pto-type.paginated.response.dto'
import { PtoTypeResponseDto } from '../../dtos/pto-type.response.dto'

@Controller('ptos')
export class FindPtoTypePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/type')
  @UseGuards(AuthGuard)
  async get(@Query() queryParams: PaginatedQueryRequestDto): Promise<PtoTypePaginatedResponseDto> {
    const query = new FindPtoTypePaginatedQuery({
      ...queryParams,
    })

    const result: Paginated<PtoTypeResponseDto> = await this.queryBus.execute(query)

    return new PtoTypePaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
