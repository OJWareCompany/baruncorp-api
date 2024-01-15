import { ApiProperty, OmitType } from '@nestjs/swagger'
import { CreateJobRequestDto } from '../create-job/create-job.request.dto'
import { Type } from 'class-transformer'
import { IsOptional, IsDate } from 'class-validator'

export class UpdateJobRequestDto extends OmitType(CreateJobRequestDto, ['taskIds', 'projectId'] as const) {
  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly dueDate: Date
}
