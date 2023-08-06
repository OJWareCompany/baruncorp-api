import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/ddd/page.response.dto'

export class AhjNoteHistoryListResponseDto {
  id: number
  geoId: string
  name: string
  fullAhjName: string
  updatedBy: string
  updatedAt: string
}

/**
 * Controller에서 사용
 */
export class AhjNoteHistoryPaginatedResponseDto extends PaginatedResponseDto<AhjNoteHistoryListResponseDto> {
  @ApiProperty({ type: AhjNoteHistoryListResponseDto, isArray: true })
  readonly items: readonly AhjNoteHistoryListResponseDto[]
}
