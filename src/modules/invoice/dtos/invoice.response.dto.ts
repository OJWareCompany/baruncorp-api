import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { InvoiceStatusEnum, InvoiceTermsEnum } from '../domain/invoice.type'
import { InvoicePaymentType, PaymentMethodEnum } from '../../payment/domain/payment.type'
import { JobResponseDto } from '../../ordered-job/dtos/job.response.dto'
import { CreditTransactionTypeEnum } from '../../credit-transaction/domain/credit-transaction.type'

export enum PricingTypeEnum {
  Standard = 'Standard',
  Tiered = 'Tiered',
}

export class InvoicePayments {
  @ApiProperty()
  id: string

  @ApiProperty()
  paymentName: string

  @ApiProperty()
  invoiceId: string

  @ApiProperty()
  amount: number

  @ApiProperty({ enum: [...Object.values(PaymentMethodEnum), CreditTransactionTypeEnum.Deduction] })
  paymentMethod: InvoicePaymentType

  @ApiProperty()
  notes: string | null

  @ApiProperty()
  paymentDate: string

  @ApiProperty()
  @IsOptional()
  canceledAt: string | null
}

export class InvoiceClientOrganization {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  name: string
}

export class InvoiceResponseDto {
  @ApiProperty()
  @IsString()
  readonly id: string

  @ApiProperty({ enum: InvoiceStatusEnum })
  readonly status: string

  @ApiProperty()
  readonly invoiceDate: string

  @ApiProperty({ enum: InvoiceTermsEnum })
  readonly terms: number

  @ApiProperty()
  readonly dueDate: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly notesToClient: string | null

  @ApiProperty()
  @IsString()
  readonly createdAt: string

  @ApiProperty()
  @IsString()
  readonly updatedAt: string

  @ApiProperty()
  readonly servicePeriodDate: string

  @ApiProperty()
  @IsNumber()
  readonly subtotal: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly volumeTierDiscount: number | null

  @ApiProperty()
  @IsNumber()
  readonly total: number

  @ApiProperty()
  @IsNumber()
  readonly balanceDue: number

  @ApiProperty()
  @IsNumber()
  readonly amountPaid: number

  @ApiProperty()
  @IsNumber()
  readonly appliedCredit: number

  @ApiProperty({ type: InvoiceClientOrganization })
  readonly clientOrganization: InvoiceClientOrganization

  @ApiProperty({ type: JobResponseDto })
  readonly lineItems: JobResponseDto[]

  @ApiProperty({ type: InvoicePayments, isArray: true })
  readonly payments: InvoicePayments[]

  @ApiProperty()
  @IsNumber()
  readonly totalOfPayment: number

  @ApiProperty()
  @IsOptional()
  @IsDate()
  readonly issuedAt: Date | null

  @ApiProperty()
  readonly currentCc: string[]

  constructor(props: InvoiceResponseDto) {
    initialize(this, props)
  }
}
