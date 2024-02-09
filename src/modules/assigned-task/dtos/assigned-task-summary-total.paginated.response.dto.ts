import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { AssignedTaskSummaryDoneResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-done.response.dto'
import { AssignedTaskSummaryTotalResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-total.response.dto'

export class AssignedTaskSummaryTotalPaginatedResponseDto extends PaginatedResponseDto<AssignedTaskSummaryTotalResponseDto> {
  @ApiProperty({ type: AssignedTaskSummaryTotalResponseDto, isArray: true })
  items: readonly AssignedTaskSummaryTotalResponseDto[]
}
