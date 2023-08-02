import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class FindAhjNotesHistorySearchQueryRequestDto {
  @ApiProperty({ default: '1239525' })
  @IsOptional()
  readonly geoId?: string
}
