import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class IssueInvoiceParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly invoiceId: string
}

export class IssueInvoiceRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly file: string | null
}
