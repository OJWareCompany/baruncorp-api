import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AssignTaskParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly assignedTaskId: string
}

export class AssignTaskRequestDto {
  @ApiProperty({ default: null })
  @IsString()
  readonly assigneeId: string
}
