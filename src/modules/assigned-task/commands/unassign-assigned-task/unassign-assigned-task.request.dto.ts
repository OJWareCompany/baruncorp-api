import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UnassignTaskParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly assignedTaskId: string
}
