import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AssignTaskParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly assignedTaskId: string
}

export class AssignTaskRequestDto {
  @ApiProperty({ default: '295fff4a-b13f-4c42-ba30-c0f39536ee6e' })
  @IsString()
  readonly assigneeId: string
}
