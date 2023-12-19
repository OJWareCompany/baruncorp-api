import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AddPrerequisiteTaskRequestParamDto {
  @ApiProperty({ default: '618d6167-0cff-4c0f-bbf6-ed7d6e14e2f1' })
  @IsString()
  readonly taskId: string
}

export class AddPrerequisiteTaskRequestDto {
  @ApiProperty({ default: '618d6167-0cff-4c0f-bbf6-ed7d6e14e2f1' })
  @IsString()
  readonly prerequisiteTaskId: string
}
