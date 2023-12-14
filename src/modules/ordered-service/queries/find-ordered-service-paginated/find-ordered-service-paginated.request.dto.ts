import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { OrderedServiceStatusEnum } from '../../domain/ordered-service.type'
import { USING_LIKE } from '../../../ordered-job/queries/find-job-paginated/find-job.paginated.request.dto'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'

export class FindOrderedServicePaginatedRequestDto {
  @ApiProperty({ default: OrderedServiceStatusEnum.Completed, enum: OrderedServiceStatusEnum })
  @IsEnum(OrderedServiceStatusEnum)
  @IsOptional()
  readonly orderedServiceStatus?: OrderedServiceStatusEnum | null

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
  readonly isRevision?: boolean | null

  @ApiProperty({ default: '', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly serviceName?: string | null

  @ApiProperty({ default: '', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly organizationName?: string | null

  @ApiProperty({ default: '', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly jobName?: string | null
}
