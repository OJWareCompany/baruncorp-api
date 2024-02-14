import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, ValidateNested } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { ScheduleDto } from '@modules/schedule/commands/update-information/put-schedule.request.dto'
import { Type } from 'class-transformer'

export class ScheduleResponseDto {
  constructor(props: ScheduleResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  readonly userId: string
  @ApiProperty({ default: 'John Doe' })
  readonly name: string
  @ApiProperty({ default: 'S- PE' })
  readonly position: string
  @ApiProperty({
    default: [
      { start: '09:00:00', end: '13:00:00' },
      { start: '14:00:00', end: '18:00:00' },
    ],
    type: ScheduleDto,
    isArray: true,
  })
  readonly schedules: ScheduleDto[]
}
