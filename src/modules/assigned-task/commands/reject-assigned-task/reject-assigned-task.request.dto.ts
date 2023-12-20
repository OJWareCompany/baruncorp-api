import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RejectAssignedTaskParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly assignedTaskId: string
}

export class RejectAssignedTaskRequestDto {
  @ApiProperty()
  @IsString()
  readonly reason: string
}
