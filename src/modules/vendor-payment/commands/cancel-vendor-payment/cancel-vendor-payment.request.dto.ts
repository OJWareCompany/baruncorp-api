import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CancelVendorPaymentParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly vendorPaymentId: string
}
