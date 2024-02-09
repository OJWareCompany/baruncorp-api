import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class CompletedTaskCountDto {
  @ApiProperty()
  @IsString()
  readonly taskId: string

  @ApiProperty()
  @IsString()
  readonly taskName: string

  @ApiProperty()
  @IsNumber()
  readonly count: number
}

export class AssignedTaskSummaryTotalResponseDto {
  @ApiProperty()
  @IsString()
  readonly userId: string

  @ApiProperty()
  @IsString()
  readonly userName: string

  @ApiProperty()
  @IsString()
  readonly tasks: CompletedTaskCountDto[]

  constructor(props: AssignedTaskSummaryTotalResponseDto) {
    initialize(this, props)
  }
}
