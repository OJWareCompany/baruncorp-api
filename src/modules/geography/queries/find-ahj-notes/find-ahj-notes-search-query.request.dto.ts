import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class FindAhjNotesSearchQueryRequestDto {
  @ApiProperty({ default: '1239525' })
  @IsOptional()
  readonly geoId?: string | null

  @ApiProperty({ default: 'city' })
  @IsOptional()
  readonly fullAhjName?: string | null

  @ApiProperty({ default: 'city' })
  @IsOptional()
  readonly name?: string | null
}
