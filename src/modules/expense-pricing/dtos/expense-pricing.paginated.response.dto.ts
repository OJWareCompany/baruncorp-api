import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { ExpensePricingResponseDto } from './expense-pricing.response.dto'

export class ExpensePricingPaginatedResponseDto extends PaginatedResponseDto<ExpensePricingResponseDto> {
  @ApiProperty({ type: ExpensePricingResponseDto, isArray: true })
  items: readonly ExpensePricingResponseDto[]
}
