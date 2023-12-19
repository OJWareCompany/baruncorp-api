import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { AutoAssignmentTypeEnum } from '../../../position/domain/position.type'

export class AddAvailableTaskRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly userId: string
}

export class AddAvailableTaskRequestDto {
  @ApiProperty()
  @IsString()
  readonly taskId: string

  @ApiProperty({ default: AutoAssignmentTypeEnum.residential, enum: AutoAssignmentTypeEnum })
  @IsEnum(AutoAssignmentTypeEnum)
  readonly autoAssignmentType: AutoAssignmentTypeEnum
}
