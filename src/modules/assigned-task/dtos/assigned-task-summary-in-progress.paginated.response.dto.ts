import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { AssignedTaskSummaryResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary.response.dto'
import { AssignedTaskSummaryInProgressResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-in-progress.response.dto'

export class AssignedTaskSummaryInProgressPaginatedResponseDto extends PaginatedResponseDto<AssignedTaskSummaryInProgressResponseDto> {
  @ApiProperty({ type: AssignedTaskSummaryInProgressResponseDto, isArray: true })
  items: readonly AssignedTaskSummaryInProgressResponseDto[]
}
