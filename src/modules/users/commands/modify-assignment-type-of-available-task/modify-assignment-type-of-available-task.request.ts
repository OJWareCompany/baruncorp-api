import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { AutoAssignmentTypeEnum } from '../../../position/domain/position.type'

export class ModifyAssignmentTypeOfAvailableTaskRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly userId: string

  @ApiProperty()
  @IsString()
  readonly taskId: string
}

export class ModifyAssignmentTypeOfAvailableTaskRequestDto {
  @ApiProperty({ default: AutoAssignmentTypeEnum.residential, enum: AutoAssignmentTypeEnum })
  @IsEnum(AutoAssignmentTypeEnum)
  readonly autoAssignmentType: AutoAssignmentTypeEnum
}
