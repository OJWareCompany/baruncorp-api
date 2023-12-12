import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateVendorInvoiceParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly vendorInvoiceId: string
}

export class UpdateVendorInvoiceRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string
}
