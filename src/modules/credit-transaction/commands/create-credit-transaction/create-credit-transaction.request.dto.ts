import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { CreditTransactionTypeEnum } from '../../domain/credit-transaction.type'

export class CreateCreditTransactionRequestDto {
  @ApiProperty()
  @IsNumber()
  readonly amount: number

  @ApiProperty({ default: CreditTransactionTypeEnum.Reload, enum: CreditTransactionTypeEnum })
  @IsEnum(CreditTransactionTypeEnum)
  readonly creditTransactionType: CreditTransactionTypeEnum

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
