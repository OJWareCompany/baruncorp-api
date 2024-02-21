import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { VendorCreditTransactionResponseDto } from './vendor-credit-transaction.response.dto'

export class VendorCreditTransactionPaginatedResponseDto extends PaginatedResponseDto<VendorCreditTransactionResponseDto> {
  @ApiProperty({ type: VendorCreditTransactionResponseDto, isArray: true })
  items: readonly VendorCreditTransactionResponseDto[]
}
