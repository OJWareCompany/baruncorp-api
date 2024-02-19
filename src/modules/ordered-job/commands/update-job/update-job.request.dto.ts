import { IsOptional, IsDate, IsEnum, IsBoolean } from 'class-validator'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { OrderedJobsPriorityEnum } from '../../domain/job.type'
import { CreateJobRequestDto } from '../create-job/create-job.request.dto'

export class UpdateJobRequestDto extends OmitType(CreateJobRequestDto, ['taskIds', 'projectId'] as const) {
  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly dueDate: Date

  @ApiProperty()
  @IsBoolean()
  readonly inReview: boolean

  @ApiProperty({ default: OrderedJobsPriorityEnum.Medium, enum: OrderedJobsPriorityEnum })
  @IsEnum(OrderedJobsPriorityEnum)
  readonly priority: OrderedJobsPriorityEnum
}
