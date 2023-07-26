import { IsOptional } from 'class-validator'

export class FindAhjNotesHistorySearchQueryRequestDto {
  @IsOptional()
  geoId?: string
}
