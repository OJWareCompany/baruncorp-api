import { IsNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateVendorInvoicedTotalParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly vendorInvoiceId: string
}

export class UpdateVendorInvoicedTotalRequestDto {
  @ApiProperty({ default: 1000 })
  @IsNumber()
  readonly total: number
}
