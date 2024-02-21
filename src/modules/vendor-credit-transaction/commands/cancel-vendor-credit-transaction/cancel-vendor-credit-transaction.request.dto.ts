import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CancelVendorCreditTransactionParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly vendorCreditTransactionId: string
}
