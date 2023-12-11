/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Get, Inject, Param } from '@nestjs/common'
import { ExpensePricingResponseDto } from '../../dtos/expense-pricing.response.dto'
import { FindExpensePricingRequestDto } from './find-expense-pricing.request.dto'
import { ExpensePricingRepositoryPort } from '../../database/expense-pricing.repository.port'
import { EXPENSE_PRICING_REPOSITORY } from '../../expense-pricing.di-token'
import { ExpensePricingEntity } from '../../domain/expense-pricing.entity'
import { ExpensePricingMapper } from '../../expense-pricing.mapper'

@Controller('expense-pricings')
export class FindExpensePricingHttpController {
  constructor(
    // @ts-ignore
    @Inject(EXPENSE_PRICING_REPOSITORY) private readonly expenseRepo: ExpensePricingRepositoryPort,
    private readonly mapper: ExpensePricingMapper,
  ) {}

  @Get(':expensePricingId')
  async get(@Param() request: FindExpensePricingRequestDto): Promise<ExpensePricingResponseDto> {
    const entity: ExpensePricingEntity = await this.expenseRepo.findOneOrThrow(request.organizationId, request.taskId)
    return this.mapper.toResponse(entity)
  }
}
