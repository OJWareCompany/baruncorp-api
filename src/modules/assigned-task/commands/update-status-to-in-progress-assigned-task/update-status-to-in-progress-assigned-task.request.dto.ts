import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateStatusToInProgressAssignedTaskRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly assignedTaskId: string
}
