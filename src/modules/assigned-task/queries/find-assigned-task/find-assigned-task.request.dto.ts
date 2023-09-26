import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindAssignedTaskRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly assignedTaskId: string
}
