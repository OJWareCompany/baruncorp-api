import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindVendorPaymentRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly vendorPaymentId: string
}
