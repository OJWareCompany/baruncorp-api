import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindAvailableWorkersRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly assignedTaskId: string
}
