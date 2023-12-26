import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { PositionResponseDto } from './position.response.dto'
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { LicenseTypeEnum } from '../../license/dtos/license.response.dto'

export class PositionTask {
  @ApiProperty()
  @IsString()
  readonly taskId: string

  @ApiProperty()
  @IsString()
  readonly taskName: string

  @ApiProperty()
  @IsString()
  readonly autoAssignmentType: string
}

export class PositionPaginatedResponseFields {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string

  @ApiProperty({ default: 'Sr. Designer' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: null })
  @IsString()
  @IsOptional()
  readonly description: string | null

  @ApiProperty({ default: null })
  @IsNumber()
  readonly maxAssignedTasksLimit: number | null

  @ApiProperty()
  @ValidateNested()
  readonly tasks: PositionTask[]

  @ApiProperty()
  @IsEnum(LicenseTypeEnum)
  @IsOptional()
  readonly licenseType: LicenseTypeEnum | null

  constructor(props: PositionResponseDto) {
    initialize(this, props)
  }
}

export class PositionPaginatedResponseDto extends PaginatedResponseDto<PositionPaginatedResponseFields> {
  @ApiProperty({ type: PositionPaginatedResponseFields, isArray: true })
  items: readonly PositionPaginatedResponseFields[]
}
