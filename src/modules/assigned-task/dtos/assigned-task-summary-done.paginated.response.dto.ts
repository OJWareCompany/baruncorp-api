import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { AssignedTaskSummaryDoneResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-done.response.dto'

export class AssignedTaskSummaryDonePaginatedResponseDto extends PaginatedResponseDto<AssignedTaskSummaryDoneResponseDto> {
  @ApiProperty({ type: AssignedTaskSummaryDoneResponseDto, isArray: true })
  items: readonly AssignedTaskSummaryDoneResponseDto[]
}
