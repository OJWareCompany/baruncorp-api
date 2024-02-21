import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindVendorCreditTransactionRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly vendorCreditTransactionId: string
}
