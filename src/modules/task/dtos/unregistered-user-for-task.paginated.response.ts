import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { UnregisteredUserForTaskResponseDto } from './unregistered-user-for-task.response'

export class UnregisteredUserForTaskPaginatedResponseDto extends PaginatedResponseDto<UnregisteredUserForTaskResponseDto> {
  @ApiProperty({ type: UnregisteredUserForTaskResponseDto, isArray: true })
  items: readonly UnregisteredUserForTaskResponseDto[]
}
