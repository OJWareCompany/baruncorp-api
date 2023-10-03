import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { InvoiceTermsEnum } from '../../domain/invoice.type'

export class CreateInvoiceRequestDto {
  @ApiProperty({ default: new Date('2023-10-01T05:14:33.599Z') })
  @IsDate()
  @Type(() => Date)
  readonly invoiceDate: Date = new Date()

  @ApiProperty({ enum: InvoiceTermsEnum })
  @IsEnum(InvoiceTermsEnum)
  readonly terms: InvoiceTermsEnum

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly notesToClient: string | null

  @ApiProperty()
  @IsString()
  readonly clientOrganizationId: string

  @ApiProperty({ default: '2023-02' })
  @IsDate()
  @Type(() => Date)
  readonly serviceMonth: Date
}
