import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { AutoAssignmentTypeEnum } from '../../domain/position.type'

export class AddPositionTaskParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly positionId: string
}

export class AddPositionTaskRequestDto {
  @ApiProperty({ default: '911fe9ac-94b8-4a0e-b478-56e88f4aa7d7' })
  @IsString()
  readonly taskId: string

  @ApiProperty({ default: AutoAssignmentTypeEnum.all, enum: AutoAssignmentTypeEnum })
  @IsEnum(AutoAssignmentTypeEnum)
  readonly autoAssignmentType: AutoAssignmentTypeEnum
}
