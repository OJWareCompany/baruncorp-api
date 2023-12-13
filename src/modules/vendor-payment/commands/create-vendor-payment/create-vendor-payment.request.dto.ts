import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { PaymentMethodEnum } from '../../domain/vendor-payment.type'

export class CreateVendorPaymentRequestDto {
  @ApiProperty()
  @IsString()
  readonly vendorInvoiceId: string

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
