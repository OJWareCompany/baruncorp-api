import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { InvoiceTermsEnum } from '../../../invoice/domain/invoice.type'
import { Type } from 'class-transformer'

export class CreateVendorInvoiceRequestDto {
  @ApiProperty({ default: 'asda' })
  @IsString()
  readonly organizationId: string

  @ApiProperty({ default: '2023-12-19T11:57:01.688Z' })
  @IsDate()
  @Type(() => Date)
  readonly invoiceDate: Date = new Date()

  @ApiProperty({ default: '' })
  @IsDate()
  @Type(() => Date)
  readonly serviceMonth: Date

  @ApiProperty({ default: '' })
  @IsString()
  readonly invoiceNumber: string

  @ApiProperty({ enum: InvoiceTermsEnum })
  @IsEnum(InvoiceTermsEnum)
  readonly terms: InvoiceTermsEnum

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  readonly note: string | null
}
