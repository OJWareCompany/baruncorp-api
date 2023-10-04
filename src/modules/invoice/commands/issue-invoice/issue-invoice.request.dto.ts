import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsOptional, IsString } from 'class-validator'

export class IssueInvoiceParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly invoiceId: string
}

export class IssueInvoiceRequestDto {
  @ApiProperty()
  @IsArray()
  readonly files: []
}
