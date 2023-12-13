import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindVendorInvoiceRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly vendorInvoiceId: string
}
