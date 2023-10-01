import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindPaymentRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly paymentId: string
}
