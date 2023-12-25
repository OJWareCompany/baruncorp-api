import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AddPrerequisiteTaskRequestParamDto {
  @ApiProperty({ default: 'b00bc4bb-6f1c-4397-8f9e-c42aa4d0b1b4' })
  @IsString()
  readonly taskId: string
}

export class AddPrerequisiteTaskRequestDto {
  @ApiProperty({ default: '911fe9ac-94b8-4a0e-b478-56e88f4aa7d7' })
  @IsString()
  readonly prerequisiteTaskId: string
}
