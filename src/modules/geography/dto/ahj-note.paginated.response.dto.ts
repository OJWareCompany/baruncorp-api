import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'

export class AhjNoteListResponseDto {
  @ApiProperty()
  geoId: string

  @ApiProperty()
  name: string

  @ApiProperty()
  fullAhjName: string

  @ApiProperty()
  updatedBy: string

  @ApiProperty()
  updatedAt: string

  @ApiProperty()
  type: string | null
}

/**
 * Controller에서 사용
 */
export class AhjNotePaginatedResponseDto extends PaginatedResponseDto<AhjNoteListResponseDto> {
  @ApiProperty({ type: AhjNoteListResponseDto, isArray: true })
  readonly items: readonly AhjNoteListResponseDto[]
}
