import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { AhjNoteHistoryTypeEnum } from '../domain/ahj-job-note.type'

export class AhjNoteHistoryListResponseDto {
  @ApiProperty()
  geoId: string

  @ApiProperty()
  historyType: AhjNoteHistoryTypeEnum

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
