import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { CreditTransactionResponseDto } from './credit-transaction.response.dto'

export class CreditTransactionPaginatedResponseDto extends PaginatedResponseDto<CreditTransactionResponseDto> {
  @ApiProperty({ type: CreditTransactionResponseDto, isArray: true })
  items: readonly CreditTransactionResponseDto[]
}
