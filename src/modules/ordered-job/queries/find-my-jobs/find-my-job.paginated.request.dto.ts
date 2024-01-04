import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsEnum } from 'class-validator'
import { JobStatusEnum } from '../../domain/job.type'

export class FindMyJobPaginatedRequestDto {
  @ApiProperty({ default: JobStatusEnum.In_Progress, enum: JobStatusEnum })
  @IsEnum(JobStatusEnum)
  @IsOptional()
  readonly jobStatus?: JobStatusEnum | null
}
