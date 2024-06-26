import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CancelPaymentParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly paymentId: string
}
