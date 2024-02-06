import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { AssignedTaskStatusEnum } from '../domain/assigned-task.type'
import { PrerequisiteTaskVO } from '../../ordered-job/domain/value-objects/assigned-task.value-object'

export class AssignedTaskSummaryInProgressResponseDto {
  @ApiProperty()
  @IsString()
  readonly userId: string

  @ApiProperty()
  @IsString()
  readonly organizationName: string

  @ApiProperty()
  @IsString()
  readonly userName: string

  @ApiProperty()
  @IsNumber()
  readonly inProgressAssignedTaskCount: number

  constructor(props: AssignedTaskSummaryInProgressResponseDto) {
    initialize(this, props)
  }
}
