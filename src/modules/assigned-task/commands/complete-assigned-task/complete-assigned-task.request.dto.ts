import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CompleteAssignedTaskParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly assignedTaskId: string
}
