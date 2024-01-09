import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PtoTenurePolicyPaginatedResponseDto } from '../../dtos/pto-tenure-policy.paginated.response.dto'
import { FindPtoTenurePolicyPaginatedQuery } from './find-pto-tenure-policy.paginated.query-handler'
import { PtoTenurePolicyResponseDto } from '../../dtos/pto-tenure-policy.response.dto'
import { AuthGuard } from '../../../auth/guards/authentication.guard'

@Controller('pto-tenure-policies')
export class FindPtoTenurePolicyPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @UseGuards(AuthGuard)
  async get(@Query() queryParams: PaginatedQueryRequestDto): Promise<PtoTenurePolicyPaginatedResponseDto> {
    const query = new FindPtoTenurePolicyPaginatedQuery({
      ...queryParams,
    })

    const result: Paginated<PtoTenurePolicyResponseDto> = await this.queryBus.execute(query)

    return new PtoTenurePolicyPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
