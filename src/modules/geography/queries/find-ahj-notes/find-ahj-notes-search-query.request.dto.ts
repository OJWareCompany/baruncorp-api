import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindAhjNotesSearchQueryRequestDto {
  @ApiProperty({ default: '1239525' })
  @IsString()
  @IsOptional()
  readonly geoId?: string | null

  @ApiProperty({ default: 'city' })
  @IsString()
  @IsOptional()
  readonly fullAhjName?: string | null

  @ApiProperty({ default: 'city' })
  @IsString()
  @IsOptional()
  readonly name?: string | null
}
