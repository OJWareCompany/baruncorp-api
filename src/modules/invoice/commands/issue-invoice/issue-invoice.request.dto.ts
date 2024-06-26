import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsOptional, IsString } from 'class-validator'
import _ from 'lodash'
import { processEmails } from '../../../../libs/utils/processEmails'

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
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  readonly files: any[]

  @ApiProperty({ default: ['hyomin@oj.vision'] })
  @Transform(({ value }) => {
    // console.log(value)
    const result = processEmails(value)
    // console.log(result)
    return result
  })
  // @Transform(({ value }) => (value ? value.split(',') : []))
  @IsEmail({}, { each: true })
  @IsOptional()
  readonly cc?: string[]
}
