import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

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

  @ApiProperty({ default: '' })
  @IsString()
  createdAt: string

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  updatedAt: string | null
}
