import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { CreditTransactionsTransactionType } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'

/**
 * Remove interface after select fields
 */
export class CreditTransactionResponseDto {
  @ApiProperty()
  @IsString()
  readonly id: string

  @ApiProperty()
  @IsString()
  readonly clientOrganizationId: string

  @ApiProperty()
  @IsString()
  readonly createdBy: string

  @ApiProperty()
  @IsString()
  readonly createdByUserId: string

  @ApiProperty()
  @IsNumber()
  readonly amount: number

  @ApiProperty({ default: CreditTransactionsTransactionType.Reload, enum: CreditTransactionsTransactionType })
  @IsEnum(CreditTransactionsTransactionType)
  readonly creditTransactionType: CreditTransactionsTransactionType

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly relatedInvoiceId: string | null

  @ApiProperty()
  @IsDate()
  readonly transactionDate: Date

  @ApiProperty()
  @IsOptional()
  @IsDate()
  readonly canceledAt: Date | null

  constructor(props: CreditTransactionResponseDto) {
    initialize(this, props)
  }
}
