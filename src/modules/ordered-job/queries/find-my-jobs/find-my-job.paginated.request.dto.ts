import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator'
import { ProjectPropertyTypeEnum, MountingTypeEnum } from '../../../project/domain/project.type'
import { AutoOnlyJobStatusEnum, JobStatusEnum, OrderedJobsPriorityEnum } from '../../domain/job.type'
import { DESCRIPTION } from '../find-job-paginated/find-job.paginated.request.dto'

export class FindMyJobPaginatedRequestDto {
  @ApiProperty({ default: '3480 Northwest 33rd Court', description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  readonly jobName?: string | null

  @ApiProperty({ default: '', description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  readonly projectNumber?: string | null

  @ApiProperty({ default: '', description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  readonly propertyFullAddress?: string | null

  @ApiProperty({ default: ProjectPropertyTypeEnum.Commercial, enum: ProjectPropertyTypeEnum })
  @IsEnum(ProjectPropertyTypeEnum)
  @IsOptional()
  readonly projectPropertyType?: ProjectPropertyTypeEnum | null

  @ApiProperty({
    default: JobStatusEnum.Completed,
    enum: [...Object.values(JobStatusEnum), ...Object.values(AutoOnlyJobStatusEnum)],
    nullable: true,
  })
  @IsEnum([...Object.values(JobStatusEnum), ...Object.values(AutoOnlyJobStatusEnum)])
  @IsOptional()
  readonly jobStatus?: JobStatusEnum | AutoOnlyJobStatusEnum | null

  @ApiProperty({ default: MountingTypeEnum.Ground_Mount, enum: MountingTypeEnum })
  @IsEnum(MountingTypeEnum)
  @IsOptional()
  readonly mountingType?: MountingTypeEnum | null

  @ApiProperty({ default: false })
  @IsBoolean()
  @Transform(({ value }) => {
    const isBoolean = ['true', 'false'].includes(value)
    return isBoolean ? value === 'true' : null
  })
  @IsOptional()
  readonly isExpedited?: boolean | null

  @ApiProperty({ default: false })
  @IsBoolean()
  @Transform(({ value }) => {
    const isBoolean = ['true', 'false'].includes(value)
    return isBoolean ? value === 'true' : null
  })
  @IsOptional()
  readonly inReview?: boolean | null

  @ApiProperty({ default: OrderedJobsPriorityEnum.Medium, enum: OrderedJobsPriorityEnum })
  @IsEnum(OrderedJobsPriorityEnum)
  @IsOptional()
  readonly priority?: OrderedJobsPriorityEnum | null

  @ApiProperty({ default: '', description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  readonly propertyOwner?: string | null
}
