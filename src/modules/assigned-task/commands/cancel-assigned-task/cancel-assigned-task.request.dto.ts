import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CancelAssignedTaskRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly assignedTaskId: string
}
