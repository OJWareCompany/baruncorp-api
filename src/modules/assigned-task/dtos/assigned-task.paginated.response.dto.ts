import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { AssignedTaskResponseDto } from './assigned-task.response.dto'

export class AssignedTaskPaginatedResponseDto extends PaginatedResponseDto<AssignedTaskResponseDto> {
  @ApiProperty({ type: AssignedTaskResponseDto, isArray: true })
  items: readonly AssignedTaskResponseDto[]
}
