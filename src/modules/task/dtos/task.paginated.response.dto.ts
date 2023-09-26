import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { TaskResponseDto } from './task.response.dto'

export class TaskPaginatedResponseDto extends PaginatedResponseDto<TaskResponseDto> {
  @ApiProperty({ type: TaskResponseDto, isArray: true })
  items: readonly TaskResponseDto[]
}
