import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../common/helpers/pagination/page.res.dto'

export class AhjNoteListResponseDto {
  geoId: string
  name: string
  fullAhjName: string
  updatedBy: string
  updatedAt: string
}

/**
 * Controller에서 사용
 */
export class AhjNotePaginatedResponseDto extends PaginatedResponseDto<AhjNoteListResponseDto> {
  @ApiProperty({ type: AhjNoteListResponseDto, isArray: true })
  readonly items: readonly AhjNoteListResponseDto[]
}
