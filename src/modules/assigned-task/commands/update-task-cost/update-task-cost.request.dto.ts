import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateTaskCostParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly assignedTaskId: string
}

export class UpdateTaskCostRequestDto {
  @ApiProperty({ default: null })
  @IsNumber()
  @IsOptional()
  readonly cost: number | null
}
