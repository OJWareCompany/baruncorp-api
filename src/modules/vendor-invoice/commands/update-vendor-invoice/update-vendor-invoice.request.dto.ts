import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { VendorInvoiceTermsEnum } from '../../domain/vendor-invoice.type'
import { Type } from 'class-transformer'

export class UpdateVendorInvoiceParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly vendorInvoiceId: string
}

export class UpdateVendorInvoiceRequestDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  readonly invoiceDate: Date

  @ApiProperty({ enum: VendorInvoiceTermsEnum, default: VendorInvoiceTermsEnum.Days30 })
  @IsEnum(VendorInvoiceTermsEnum)
  readonly terms: VendorInvoiceTermsEnum

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly note: string | null
}
