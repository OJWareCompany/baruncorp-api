import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { AutoAssignmentTypeEnum } from '../../domain/position.type'

export class UpdatePositionTaskAutoAssignmentTypeParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly positionId: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly taskId: string
}

export class UpdatePositionTaskAutoAssignmentTypeRequestDto {
  @ApiProperty({ default: AutoAssignmentTypeEnum.all, enum: AutoAssignmentTypeEnum })
  @IsEnum(AutoAssignmentTypeEnum)
  readonly autoAssignmentType: AutoAssignmentTypeEnum
}
