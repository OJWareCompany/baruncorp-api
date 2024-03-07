import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class BackToNotStartedAssignedTaskRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly assignedTaskId: string
}
