import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { AssignedTaskStatusEnum } from '../domain/assigned-task.type'
import { PrerequisiteTaskVO } from '../../ordered-job/domain/value-objects/assigned-task.value-object'

export class AssignedTaskSummaryDetailResponseDto {
  constructor(props: AssignedTaskSummaryDetailResponseDto) {
    initialize(this, props)
  }
  @ApiProperty()
  @IsString()
  jobName: string
  @ApiProperty()
  @IsString()
  taskName: string
  @ApiProperty()
  @IsString()
  jobId: string
  @ApiProperty()
  @IsEnum(AssignedTaskStatusEnum)
  status: AssignedTaskStatusEnum
}
