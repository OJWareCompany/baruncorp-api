import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { DepartmentResponseDto } from './department.response.dto'

export class DepartmentPaginatedResponseDto extends PaginatedResponseDto<DepartmentResponseDto> {
  @ApiProperty({ type: DepartmentResponseDto, isArray: true })
  items: readonly DepartmentResponseDto[]
}
