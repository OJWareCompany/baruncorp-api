import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'

export class AhjNoteHistoryListResponseDto {
  @ApiProperty()
  id: number

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
export class AhjNoteHistoryPaginatedResponseDto extends PaginatedResponseDto<AhjNoteHistoryListResponseDto> {
  @ApiProperty({ type: AhjNoteHistoryListResponseDto, isArray: true })
  readonly items: readonly AhjNoteHistoryListResponseDto[]
}
