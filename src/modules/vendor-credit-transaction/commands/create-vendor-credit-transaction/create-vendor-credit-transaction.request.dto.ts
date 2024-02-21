import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { VendorCreditTransactionTypeEnum } from '../../domain/vendor-credit-transaction.type'

export class CreateVendorCreditTransactionRequestDto {
  @ApiProperty()
  @IsNumber()
  readonly amount: number

  @ApiProperty({ default: VendorCreditTransactionTypeEnum.Reload, enum: VendorCreditTransactionTypeEnum })
  @IsEnum(VendorCreditTransactionTypeEnum)
  readonly creditTransactionType: VendorCreditTransactionTypeEnum

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly relatedInvoiceId?: string | null

  @ApiProperty()
  @IsString()
  readonly clientOrganizationId: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly note: string | null
}
