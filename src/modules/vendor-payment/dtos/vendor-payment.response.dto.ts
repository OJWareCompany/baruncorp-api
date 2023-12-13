import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { PaymentMethodEnum } from '../domain/vendor-payment.type'

/**
 * Remove interface after select fields
 */
export class VendorPaymentResponseDto {
  @ApiProperty()
  @IsString()
  readonly id: string

  @ApiProperty()
  readonly vendorInvoiceId: string

  @ApiProperty()
  readonly amount: number

  @ApiProperty({ enum: PaymentMethodEnum })
  readonly paymentMethod: PaymentMethodEnum

  @ApiProperty()
  readonly paymentDate: string

  @ApiProperty()
  readonly notes: string | null

  @ApiProperty()
  readonly canceledAt: string | null

  @ApiProperty()
  readonly organizationName: string

  @ApiProperty()
  readonly organizationId: string

  constructor(props: VendorPaymentResponseDto) {
    initialize(this, props)
  }
}
