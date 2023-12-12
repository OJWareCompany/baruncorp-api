import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { InvoiceTermsEnum } from '../../../invoice/domain/invoice.type'
import { Type } from 'class-transformer'

export class CreateVendorInvoiceRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly organizationId: string

  @ApiProperty({ default: '' })
  @IsString()
  @Type(() => Date)
  readonly invoiceDate: Date = new Date()

  @ApiProperty({ default: '' })
  @IsString()
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
