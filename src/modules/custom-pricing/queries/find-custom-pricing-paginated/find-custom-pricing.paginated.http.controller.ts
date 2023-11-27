import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { CustomPricings } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { CustomPricingPaginatedResponseDto } from '../../dtos/custom-pricing.paginated.response.dto'
import { FindCustomPricingPaginatedRequestDto } from './find-custom-pricing.paginated.request.dto'
import { FindCustomPricingPaginatedQuery } from './find-custom-pricing.paginated.query-handler'

@Controller('custom-pricings')
export class FindCustomPricingPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindCustomPricingPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<CustomPricingPaginatedResponseDto> {
    const command = new FindCustomPricingPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<CustomPricings> = await this.queryBus.execute(command)

    return new CustomPricingPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
