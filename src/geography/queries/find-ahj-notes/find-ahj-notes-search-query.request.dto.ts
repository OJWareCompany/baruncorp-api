import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class FindAhjNotesSearchQueryRequestDto {
  @ApiProperty({ default: '0100460' })
  @IsOptional()
  readonly geoId?: string

  @ApiProperty({ default: 'city' })
  @IsOptional()
  readonly fullAhjName?: string

  @ApiProperty({ default: 'city' })
  @IsOptional()
  readonly name?: string
}
