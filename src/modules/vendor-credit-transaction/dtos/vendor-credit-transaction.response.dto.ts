import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { VendorCreditTransactionTypeEnum } from '../domain/vendor-credit-transaction.type'

/**
 * Remove interface after select fields
 */
export class VendorCreditTransactionResponseDto {
  @ApiProperty()
  @IsString()
  readonly id: string

  @ApiProperty()
  @IsString()
  readonly vendorOrganizationId: string

  @ApiProperty()
  @IsString()
  readonly createdBy: string

  @ApiProperty()
  @IsString()
  readonly createdByUserId: string

  @ApiProperty()
  @IsNumber()
  readonly amount: number

  @ApiProperty({ default: VendorCreditTransactionTypeEnum.Reload, enum: VendorCreditTransactionTypeEnum })
  @IsEnum(VendorCreditTransactionTypeEnum)
  readonly creditTransactionType: VendorCreditTransactionTypeEnum

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly relatedVendorInvoiceId: string | null

  @ApiProperty()
  @IsDate()
  readonly transactionDate: Date

  @ApiProperty()
  @IsOptional()
  @IsDate()
  readonly canceledAt: Date | null

  constructor(props: VendorCreditTransactionResponseDto) {
    initialize(this, props)
  }
}
