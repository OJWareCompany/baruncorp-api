import { IsOptional, IsDate, IsEnum, IsBoolean } from 'class-validator'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { CreateJobRequestDto } from '../create-job/create-job.request.dto'
import { MountingTypeEnum } from '../../../project/domain/project.type'
import { OrderedJobsPriorityEnum } from '../../domain/value-objects/priority.value-object'

export class UpdateJobRequestDto extends OmitType(CreateJobRequestDto, [
  'dueDate',
  'taskIds',
  'projectId',
  'mountingType',
] as const) {
  @ApiProperty({ enum: MountingTypeEnum, example: MountingTypeEnum.Ground_Mount })
  @IsEnum(MountingTypeEnum)
  @IsOptional()
  readonly mountingType?: MountingTypeEnum | null

  @ApiProperty()
  @IsBoolean()
  readonly inReview: boolean

  @ApiProperty({ default: OrderedJobsPriorityEnum.Medium, enum: OrderedJobsPriorityEnum })
  @IsEnum(OrderedJobsPriorityEnum)
  readonly priority: OrderedJobsPriorityEnum
}
