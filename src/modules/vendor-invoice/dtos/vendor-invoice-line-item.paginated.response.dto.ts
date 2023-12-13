import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { VendorInvoiceLineItemResponse } from './vendor-invoice-line-item.response.dto'

export class VendorInvoiceLineItemPaginatedResponseDto extends PaginatedResponseDto<VendorInvoiceLineItemResponse> {
  @ApiProperty({ type: VendorInvoiceLineItemResponse, isArray: true })
  items: readonly VendorInvoiceLineItemResponse[]
}
