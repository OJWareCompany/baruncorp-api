import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { JobStatusEnum } from '../../domain/job.type'

export enum USING_LIKE {
  description = 'Using LIKE (중간 값 검색)',
}

export class FindJobPaginatedRequestDto {
  @ApiProperty({ default: '3480 Northwest 33rd Court', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly jobName?: string | null

  @ApiProperty({ default: '', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly projectNumber?: string | null

  @ApiProperty({ default: '', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly propertyFullAddress?: string | null

  @ApiProperty({ default: ProjectPropertyTypeEnum.Commercial, enum: ProjectPropertyTypeEnum })
  @IsEnum(ProjectPropertyTypeEnum)
  @IsOptional()
  readonly propertyPropertyType?: ProjectPropertyTypeEnum | null

  @ApiProperty({ default: JobStatusEnum.Completed, enum: JobStatusEnum })
  @IsEnum(JobStatusEnum)
  @IsOptional()
  readonly jobStatus?: JobStatusEnum | null

  @ApiProperty({ default: MountingTypeEnum.Ground_Mount, enum: MountingTypeEnum })
  @IsEnum(MountingTypeEnum)
  @IsOptional()
  readonly mountingType?: MountingTypeEnum | null

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  readonly isExpedited?: boolean | null
}
