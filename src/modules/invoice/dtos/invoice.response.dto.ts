import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsNumber } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { InvoiceStatusEnum, InvoiceTermsEnum } from '../domain/invoice.type'

export class InvoiceClientOrganization {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  name: string
}

export class InvoiceResponseDto {
  @ApiProperty()
  @IsString()
  readonly id: string

  @ApiProperty({ enum: InvoiceStatusEnum })
  readonly status: string

  @ApiProperty()
  readonly invoiceDate: string

  @ApiProperty({ enum: InvoiceTermsEnum })
  readonly terms: number

  @ApiProperty()
  readonly dueDate: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly notesToClient: string | null

  @ApiProperty()
  @IsString()
  readonly createdAt: string

  @ApiProperty()
  @IsString()
  readonly updatedAt: string

  @ApiProperty()
  readonly servicePeriodDate: string

  @ApiProperty()
  @IsNumber()
  readonly subtotal: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly discount: number | null

  @ApiProperty()
  @IsNumber()
  readonly total: number

  @ApiProperty({ type: InvoiceClientOrganization })
  readonly clientOrganization: InvoiceClientOrganization

  constructor(props: InvoiceResponseDto) {
    initialize(this, props)
  }
}
