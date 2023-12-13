import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteVendorInvoiceParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly vendorInvoiceId: string
}
