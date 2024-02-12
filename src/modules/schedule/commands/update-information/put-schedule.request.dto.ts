import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { IsTime } from '@libs/decorators/custom/is-time.decorator'
import { ScheduleTimeFormatException } from '@modules/schedule/domain/schedule.error'

export class PutScheduleParamRequestDto {
  @ApiProperty({ default: '529cec06-1fb7-4284-b56f-9f31219cd099' })
  @IsString()
  readonly userId: string
}

export class ScheduleDto {
  @ApiProperty({ default: '09:00:00' })
  @IsTime(new ScheduleTimeFormatException())
  readonly start: string
  @ApiProperty({ default: '13:00:00' })
  @IsTime(new ScheduleTimeFormatException())
  readonly end: string
}

export class PutScheduleRequestDto {
  @ApiProperty({
    default: [
      { start: '09:00:00', end: '13:00:00' },
      { start: '14:00:00', end: '18:00:00' },
    ],
    type: ScheduleDto,
  })
  @IsArray()
  @ValidateNested({ each: true }) // 배열 내 각 객체에 대해 유효성 검사 활성화
  @Type(() => ScheduleDto) // 배열 내 객체를 ScheduleDto 타입으로 변환
  readonly schedules: ScheduleDto[]
}
