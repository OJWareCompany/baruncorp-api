import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ExpensePricings } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { ExpensePricingPaginatedResponseDto } from '../../dtos/expense-pricing.paginated.response.dto'
import { FindExpensePricingPaginatedRequestDto } from './find-expense-pricing.paginated.request.dto'
import { FindExpensePricingPaginatedQuery } from './find-expense-pricing.paginated.query-handler'
import { ExpensePricingResponseDto } from '../../dtos/expense-pricing.response.dto'

@Controller('expense-pricings')
export class FindExpensePricingPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindExpensePricingPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<ExpensePricingPaginatedResponseDto> {
    const command = new FindExpensePricingPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<ExpensePricingResponseDto> = await this.queryBus.execute(command)

    return new ExpensePricingPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
