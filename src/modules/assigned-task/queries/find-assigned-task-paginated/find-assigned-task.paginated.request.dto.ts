import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { AssignedTaskStatusEnum } from '../../domain/assigned-task.type'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { USING_LIKE } from '../../../ordered-job/queries/find-job-paginated/find-job.paginated.request.dto'

export class FindAssignedTaskPaginatedRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  readonly projectNumber?: string | null
  @ApiProperty({ default: '', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly jobName?: string | null
  @ApiProperty({ default: '', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly assigneeName?: string | null
  @ApiProperty({ default: '', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly taskName?: string | null

  @ApiProperty({ default: '', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly serviceName?: string | null

  @ApiProperty({ default: '', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly organizationName?: string | null

  @ApiProperty({ default: AssignedTaskStatusEnum.Completed, enum: AssignedTaskStatusEnum })
  @IsEnum(AssignedTaskStatusEnum)
  @IsOptional()
  readonly status?: AssignedTaskStatusEnum | null

  @ApiProperty({ default: ProjectPropertyTypeEnum.Commercial, enum: ProjectPropertyTypeEnum })
  @IsEnum(ProjectPropertyTypeEnum)
  @IsOptional()
  readonly projectPropertyType?: ProjectPropertyTypeEnum | null

  @ApiProperty({ default: MountingTypeEnum.Ground_Mount, enum: MountingTypeEnum })
  @IsEnum(MountingTypeEnum)
  @IsOptional()
  readonly mountingType?: MountingTypeEnum | null

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  readonly isVendor?: boolean | null
  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  readonly isRevision?: boolean | null
}
