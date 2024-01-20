import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { JobStatusEnum } from '../../domain/job.type'

export class UpdateJobStatusParamRequestDto {
  @ApiProperty({ default: 'a3c7e040-44ff-48c3-bbb8-9fb53024ba73' })
  @IsString()
  readonly jobId: string
}

export class UpdateJobStatusRequestDto {
  @ApiProperty({ default: JobStatusEnum.Completed, enum: JobStatusEnum })
  @IsEnum(JobStatusEnum)
  readonly status: JobStatusEnum
}
