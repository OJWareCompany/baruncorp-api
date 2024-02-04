import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { AssignedTaskStatusEnum } from '../domain/assigned-task.type'
import { PrerequisiteTaskVO } from '../../ordered-job/domain/value-objects/assigned-task.value-object'

class AssignedTaskSummaryDetailDto {
  @ApiProperty()
  @IsString()
  jobName: string
  @ApiProperty()
  @IsString()
  taskName: string
  @ApiProperty()
  @IsString()
  jobId: string
}

export class AssignedTaskSummaryResponseDto {
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
  readonly allAssignedTaskCount: number

  @ApiProperty()
  @IsNumber()
  readonly completedAssignedTaskCount: number

  @ApiProperty()
  @IsNumber()
  readonly inProgressAssignedTaskCount: number

  @ApiProperty()
  @IsNumber()
  readonly canceledAssignedTaskCount: number

  constructor(props: AssignedTaskSummaryResponseDto) {
    initialize(this, props)
  }
}
