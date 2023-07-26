import { IsOptional } from 'class-validator'

export class FindAhjNotesSearchQueryRequestDto {
  @IsOptional()
  geoId?: string

  @IsOptional()
  fullAhjName?: string

  @IsOptional()
  name?: string
}
