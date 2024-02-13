import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsBooleanString, IsOptional, IsString } from 'class-validator'

export class FindUtilityPaginatedRequestDto {
  @ApiProperty({ default: 'AL', required: false })
  @IsOptional()
  @IsString()
  stateAbbreviation?: string
}
