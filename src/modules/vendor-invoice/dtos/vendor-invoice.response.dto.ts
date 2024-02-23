import { IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { PaymentMethodEnum, VendorInvoicePaymentType } from '../../vendor-payment/domain/vendor-payment.type'
import { VendorCreditTransactionTypeEnum } from '../../vendor-credit-transaction/domain/vendor-credit-transaction.type'

export class VendorInvoicePayment {
  @ApiProperty()
  id: string

  @ApiProperty()
  paymentName: string

  @ApiProperty()
  vendorInvoiceId: string

  @ApiProperty()
  amount: number

  @ApiProperty({ enum: [...Object.values(PaymentMethodEnum), VendorCreditTransactionTypeEnum.Deduction] })
  paymentMethod: VendorInvoicePaymentType

  @ApiProperty()
  notes: string | null

  @ApiProperty()
  paymentDate: Date

  @ApiProperty()
  @IsOptional()
  canceledAt: Date | null

  constructor(props: VendorInvoicePayment) {
    initialize(this, props)
  }
}

export class VendorInvoiceResponseDto {
  @ApiProperty({ default: '' })
  @IsString()
  id: string

  @ApiProperty({ default: '' })
  @IsString()
  organizationId: string

  @ApiProperty({ default: '' })
  @IsString()
  organizationName: string

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  daysPastDue: string | null

  @ApiProperty({ default: '' })
  @IsString()
  invoiceDate: string

  @ApiProperty({ default: 'Payment' })
  @IsString()
  transactionType: string // Payment, Vendor Credit

  @ApiProperty({ default: 100 })
  @IsNumber()
  countLineItems: number

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  dueDate: string | null

  @ApiProperty({ default: '' })
  @IsString()
  invoiceNumber: string

  @ApiProperty({ default: '' })
  @IsNumber()
  terms: number

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  note: string | null

  @ApiProperty({ default: '' })
  @IsString()
  serviceMonth: string

  @ApiProperty({ default: '' })
  @IsNumber()
  subTotal: number

  @ApiProperty({ default: '' })
  @IsNumber()
  total: number

  @ApiProperty({ default: '' })
  @IsNumber()
  invoiceTotalDifference: number

  @ApiProperty({ default: '' })
  @IsNumber()
  @IsOptional()
  internalTotalBalanceDue: number | null

  @ApiProperty({ type: VendorInvoicePayment })
  vendorPayments: VendorInvoicePayment[]

  @ApiProperty({ default: '' })
  @IsString()
  createdAt: string

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  updatedAt: string | null
}
