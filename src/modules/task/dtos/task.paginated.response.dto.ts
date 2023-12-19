import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { TaskResponseDto } from './task.response.dto'
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator'
import { AutoAssignmentTypeEnum } from '../../position/domain/position.type'
import { LicenseRequiredEnum } from '../domain/task.type'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class TaskPosition {
  @ApiProperty()
  @IsString()
  positionId: string

  @ApiProperty()
  @IsString()
  positionName: string

  @ApiProperty()
  @IsNumber()
  order: number

  @ApiProperty({ enum: AutoAssignmentTypeEnum })
  @IsEnum(AutoAssignmentTypeEnum)
  autoAssignmentType: AutoAssignmentTypeEnum
}

export class PrerequisiteTask {
  @ApiProperty()
  @IsString()
  taskId: string

  @ApiProperty()
  @IsString()
  taskName: string
}

export class TaskPaginatedResponseFields {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly serviceId: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly serviceName: string

  @ApiProperty({ default: LicenseRequiredEnum.structural, enum: LicenseRequiredEnum })
  @IsEnum(LicenseRequiredEnum)
  readonly licenseRequired: LicenseRequiredEnum

  @ApiProperty({ type: TaskPosition, isArray: true })
  @ValidateNested()
  readonly taskPositions: TaskPosition[]

  @ApiProperty({ type: PrerequisiteTask, isArray: true })
  @ValidateNested()
  readonly prerequisiteTask: PrerequisiteTask[]

  constructor(props: TaskPaginatedResponseFields) {
    initialize(this, props)
  }
}

export class TaskPaginatedResponseDto extends PaginatedResponseDto<TaskResponseDto> {
  @ApiProperty({ type: TaskResponseDto, isArray: true })
  items: readonly TaskResponseDto[]
}
