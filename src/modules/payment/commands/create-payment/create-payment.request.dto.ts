import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { PaymentMethodEnum } from '../../domain/payment.type'

export class CreatePaymentRequestDto {
  @ApiProperty()
  @IsString()
  readonly invoiceId: string

  @ApiProperty({ default: 100 })
  @IsNumber()
  readonly amount: number

  @ApiProperty()
  @IsEnum(PaymentMethodEnum)
  readonly paymentMethod: PaymentMethodEnum

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly notes: string | null
}
