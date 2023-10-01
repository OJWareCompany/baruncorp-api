import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { InvoiceResponseDto } from './invoice.response.dto'

export class InvoicePaginatedResponseDto extends PaginatedResponseDto<InvoiceResponseDto> {
  @ApiProperty({ type: InvoiceResponseDto, isArray: true })
  items: readonly InvoiceResponseDto[]
}
