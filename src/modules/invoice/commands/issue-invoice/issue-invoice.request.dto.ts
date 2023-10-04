import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsOptional, IsString } from 'class-validator'

class Attachments {
  @ApiProperty()
  @IsString()
  @IsOptional()
  filename?: string | undefined

  @ApiProperty()
  @IsString()
  @IsOptional()
  content?: string | undefined

  @ApiProperty()
  @IsString()
  @IsOptional()
  path?: string | undefined

  @ApiProperty()
  @IsString()
  @IsOptional()
  contentType?: string | undefined

  @ApiProperty()
  @IsString()
  @IsOptional()
  encoding?: string | undefined

  @ApiProperty()
  @IsString()
  @IsOptional()
  raw?: string | undefined
}

export class IssueInvoiceParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly invoiceId: string
}

export class IssueInvoiceRequestDto {
  @ApiProperty()
  @IsArray()
  attachments: Attachments[]
}
