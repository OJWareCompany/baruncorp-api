import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/ddd/page.response.dto'

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
}

/**
 * Controller에서 사용
 */
export class AhjNotePaginatedResponseDto extends PaginatedResponseDto<AhjNoteListResponseDto> {
  @ApiProperty({ type: AhjNoteListResponseDto, isArray: true })
  readonly items: readonly AhjNoteListResponseDto[]
}
