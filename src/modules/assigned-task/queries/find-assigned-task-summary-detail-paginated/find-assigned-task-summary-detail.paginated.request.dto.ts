import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { AssignedTaskStatusEnum } from '@modules/assigned-task/domain/assigned-task.type'
import { Type } from 'class-transformer'

export class FindAssignedTaskSummaryDetailPaginatedRequestDto {
  @ApiProperty({ default: 'e53b4cc2-d527-4a80-895c-a52a8c39d49d' })
  @IsString()
  readonly userId: string

  @ApiProperty({ default: AssignedTaskStatusEnum.Completed, enum: AssignedTaskStatusEnum })
  @IsEnum(AssignedTaskStatusEnum)
  @IsOptional()
  readonly status?: AssignedTaskStatusEnum

  @ApiProperty({ default: '2024-01-05', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly startedAt?: Date

  @ApiProperty({ default: '2025-01-06', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly endedAt?: Date
}
