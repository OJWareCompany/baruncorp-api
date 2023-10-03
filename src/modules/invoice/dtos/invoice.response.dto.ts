import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsNumber } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { InvoiceStatusEnum, InvoiceTermsEnum } from '../domain/invoice.type'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import { PaymentMethodEnum } from '../../payment/domain/payment.type'

export type TaskSize = 'Major' | 'Minor'
export enum TaskSizeEnum {
  Major = 'Major',
  Minor = 'Minor',
}
export type PricingType = 'Standard' | 'Tiered'
export enum PricingTypeEnum {
  Standard = 'Standard',
  Tiered = 'Tiered',
}

export class InvoicePayments {
  @ApiProperty()
  id: string

  @ApiProperty()
  invoiceId: string

  @ApiProperty()
  amount: number

  @ApiProperty({ enum: PaymentMethodEnum })
  paymentMethod: PaymentMethodEnum

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

export class LineItem {
  @ApiProperty({ example: 5 })
  readonly jobRequestNumber: number

  @ApiProperty()
  readonly description: string

  @ApiProperty()
  readonly dateSentToClient: Date // 잡이 완료된 시점? 메일을 전송한 시점? 메일을 전송했을때 완료상태가 되어야하나?

  @ApiProperty({ enum: MountingTypeEnum })
  readonly mountingType: MountingTypeEnum // 인보이스 요구사항 확인 필요

  // @ApiProperty()
  // @IsOptional()
  // readonly totalJobPriceOverride: number | null

  @ApiProperty({ type: InvoiceClientOrganization })
  readonly clientOrganization: InvoiceClientOrganization

  @ApiProperty()
  readonly containsRevisionTask: boolean

  @ApiProperty({ enum: ProjectPropertyTypeEnum })
  readonly propertyType: ProjectPropertyTypeEnum

  @ApiProperty()
  readonly state: string

  @ApiProperty()
  readonly billingCodes: string[]

  @ApiProperty({ enum: TaskSizeEnum, nullable: true })
  @IsOptional()
  readonly taskSizeForRevision: TaskSize | null

  @ApiProperty({ enum: PricingTypeEnum })
  readonly pricingType: PricingType

  @ApiProperty()
  readonly price: number

  @ApiProperty()
  readonly taskSubtotal: number

  constructor(props: InvoiceResponseDto) {
    initialize(this, props)
  }
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
  readonly discount: number | null

  @ApiProperty()
  @IsNumber()
  readonly total: number

  @ApiProperty({ type: InvoiceClientOrganization })
  readonly clientOrganization: InvoiceClientOrganization

  @ApiProperty({ type: LineItem, isArray: true })
  readonly lineItems: LineItem[]

  @ApiProperty({ type: InvoicePayments, isArray: true })
  readonly payments: InvoicePayments[]

  @ApiProperty()
  @IsNumber()
  readonly totalOfPayment: number

  constructor(props: InvoiceResponseDto) {
    initialize(this, props)
  }
}
