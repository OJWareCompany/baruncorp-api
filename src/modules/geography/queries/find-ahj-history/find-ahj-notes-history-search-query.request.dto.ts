import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindAhjNotesHistorySearchQueryRequestDto {
  @ApiProperty({ default: '1239525' })
  @IsString()
  @IsOptional()
  readonly geoId?: string | null
}
