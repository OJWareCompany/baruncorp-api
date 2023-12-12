import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { VendorInvoiceResponseDto } from './vendor-invoice.response.dto'

export class VendorInvoicePaginatedResponseDto extends PaginatedResponseDto<VendorInvoiceResponseDto> {
  @ApiProperty({ type: VendorInvoiceResponseDto, isArray: true })
  items: readonly VendorInvoiceResponseDto[]
}
