import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { InvoiceTermsEnum } from '../../domain/invoice.type'

export class UpdateInvoiceParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly invoiceId: string
}

export class UpdateInvoiceRequestDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  readonly invoiceDate: Date

  @ApiProperty()
  @IsEnum(InvoiceTermsEnum)
  readonly terms: InvoiceTermsEnum

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly notesToClient: string | null
}
