import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { JobResponseDto } from './job.response.dto'

export class JobPaginatedResponseDto extends PaginatedResponseDto<JobResponseDto> {
  @ApiProperty({ type: JobResponseDto, isArray: true })
  items: readonly JobResponseDto[]
}
