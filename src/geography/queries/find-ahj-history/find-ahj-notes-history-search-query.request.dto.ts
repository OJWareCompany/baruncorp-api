import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class FindAhjNotesHistorySearchQueryRequestDto {
  @ApiProperty({ default: '0100460' })
  @IsOptional()
  readonly geoId?: string
}
