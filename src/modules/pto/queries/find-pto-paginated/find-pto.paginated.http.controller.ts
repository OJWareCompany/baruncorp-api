import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PtoPaginatedResponseDto } from '../../dtos/pto.paginated.response.dto'
import { FindPtoPaginatedRequestDto } from './find-pto.paginated.request.dto'
import { FindPtoPaginatedQuery } from './find-pto.paginated.query-handler'
import { PtoResponseDto } from '../../dtos/pto.response.dto'
import { AuthGuard } from '../../../auth/guards/authentication.guard'

@Controller('ptos')
export class FindPtoPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  // @UseGuards(AuthGuard)
  async get(
    @Query() request: FindPtoPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<PtoPaginatedResponseDto> {
    const query = new FindPtoPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<PtoResponseDto> = await this.queryBus.execute(query)

    return new PtoPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
