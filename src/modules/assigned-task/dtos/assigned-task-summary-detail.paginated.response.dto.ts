import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { AssignedTaskResponseDto } from './assigned-task.response.dto'
import { AssignedTaskSummaryDoneResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-done.response.dto'
import { AssignedTaskSummaryDetailResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-detail.response.dto'

export class AssignedTaskSummaryDetailPaginatedResponseDto extends PaginatedResponseDto<AssignedTaskSummaryDetailResponseDto> {
  @ApiProperty({ type: AssignedTaskSummaryDetailResponseDto, isArray: true })
  items: readonly AssignedTaskSummaryDetailResponseDto[]
}
