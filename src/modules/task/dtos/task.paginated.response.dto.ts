import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { AutoAssignmentTypeEnum } from '../../position/domain/position.type'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { LicenseTypeEnum } from '../../license/dtos/license.response.dto'

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

  @ApiProperty({ default: LicenseTypeEnum.structural, enum: LicenseTypeEnum })
  @IsEnum(LicenseTypeEnum)
  @IsOptional()
  readonly licenseRequired: LicenseTypeEnum | null

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

export class TaskPaginatedResponseDto extends PaginatedResponseDto<TaskPaginatedResponseFields> {
  @ApiProperty({ type: TaskPaginatedResponseFields, isArray: true })
  items: readonly TaskPaginatedResponseFields[]
}
