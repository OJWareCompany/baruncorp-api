import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateTaskDurationParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly assignedTaskId: string
}

export class UpdateTaskDurationRequestDto {
  @ApiProperty({ default: null })
  @IsNumber()
  @IsOptional()
  readonly duration: number | null
}
