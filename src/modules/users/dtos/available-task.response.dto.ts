import { ApiProperty } from '@nestjs/swagger'
import { AutoAssignmentTypeEnum } from '../../position/domain/position.type'
import { IsEnum } from 'class-validator'

export class AvailableTaskResponseDto {
  @ApiProperty({ default: '' })
  readonly id: string

  @ApiProperty({ default: '' })
  readonly name: string

  @ApiProperty({ default: AutoAssignmentTypeEnum.all, enum: AutoAssignmentTypeEnum })
  @IsEnum(AutoAssignmentTypeEnum)
  readonly autoAssignmentType: AutoAssignmentTypeEnum
}
