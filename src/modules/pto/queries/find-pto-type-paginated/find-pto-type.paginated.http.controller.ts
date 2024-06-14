import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { FindPtoTypePaginatedQuery } from './find-pto-type.paginated.query-handler'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { PtoTypePaginatedResponseDto } from '../../dtos/pto-type.paginated.response.dto'
import { PtoTypeResponseDto } from '../../dtos/pto-type.response.dto'

@Controller('ptos')
export class FindPtoTypePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/type')
  @UseGuards(AuthGuard)
  async get(@Query() queryParams: PaginatedQueryRequestDto): Promise<PtoTypePaginatedResponseDto> {
    const query: FindPtoTypePaginatedQuery = new FindPtoTypePaginatedQuery({
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
