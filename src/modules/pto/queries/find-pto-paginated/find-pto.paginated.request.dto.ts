import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsBooleanString, IsOptional, IsString } from 'class-validator'

export class FindPtoPaginatedRequestDto {
  @ApiProperty({ default: '674e3b83-0255-46fe-bc4b-047fca3c43cf', required: false })
  @IsOptional()
  @IsString()
  readonly userId?: string
  @ApiProperty({ default: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  readonly userName?: string
  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    const isBoolean = ['true', 'false'].includes(value)
    return isBoolean ? value === 'true' : null
  })
  readonly isPaid?: boolean
}
