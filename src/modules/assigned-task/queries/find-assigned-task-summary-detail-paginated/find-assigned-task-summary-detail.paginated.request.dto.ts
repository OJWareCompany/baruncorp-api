import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { AssignedTaskStatusEnum } from '@modules/assigned-task/domain/assigned-task.type'

export class FindAssignedTaskSummaryDetailPaginatedRequestDto {
  @ApiProperty({ default: 'e53b4cc2-d527-4a80-895c-a52a8c39d49d' })
  @IsString()
  readonly userId: string

  @ApiProperty({ default: AssignedTaskStatusEnum.Completed, enum: AssignedTaskStatusEnum })
  @IsEnum(AssignedTaskStatusEnum)
  @IsOptional()
  readonly status?: AssignedTaskStatusEnum
}
