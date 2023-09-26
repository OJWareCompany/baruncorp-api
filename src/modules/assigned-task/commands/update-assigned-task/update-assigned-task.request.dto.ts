import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateAssignedTaskParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly assignedTaskId: string
}

export class UpdateAssignedTaskRequestDto {
  @ApiProperty({ default: null })
  @IsString()
  readonly assigneeId: string
}
