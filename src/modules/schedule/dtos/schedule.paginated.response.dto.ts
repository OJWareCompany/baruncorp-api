import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { ScheduleResponseDto } from './schedule.response.dto'

export class SchedulePaginatedResponseDto extends PaginatedResponseDto<ScheduleResponseDto> {
  @ApiProperty({ type: ScheduleResponseDto, isArray: true })
  items: readonly ScheduleResponseDto[]
}
