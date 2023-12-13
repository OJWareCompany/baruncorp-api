import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { VendorPaymentResponseDto } from './vendor-payment.response.dto'

export class VendorPaymentPaginatedResponseDto extends PaginatedResponseDto<VendorPaymentResponseDto> {
  @ApiProperty({ type: VendorPaymentResponseDto, isArray: true })
  items: readonly VendorPaymentResponseDto[]
}
