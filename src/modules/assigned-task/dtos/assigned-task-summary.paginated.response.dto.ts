import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { AssignedTaskSummaryResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary.response.dto'

export class AssignedTaskSummaryPaginatedResponseDto extends PaginatedResponseDto<AssignedTaskSummaryResponseDto> {
  @ApiProperty({ type: AssignedTaskSummaryResponseDto, isArray: true })
  items: readonly AssignedTaskSummaryResponseDto[]
}
