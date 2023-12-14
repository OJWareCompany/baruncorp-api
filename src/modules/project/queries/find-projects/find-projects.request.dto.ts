import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { USING_LIKE } from '../../../ordered-job/queries/find-job-paginated/find-job.paginated.request.dto'
import { ProjectPropertyTypeEnum } from '../../domain/project.type'

export class FindProjectsRequestDto {
  @ApiProperty({ default: '', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly organizationName?: string | null

  @ApiProperty({ default: null, description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly projectNumber?: string | null

  @ApiProperty({ default: '3480 Northwest 33rd Court', description: USING_LIKE.description })
  @IsString()
  @IsOptional()
  readonly propertyFullAddress?: string | null

  @ApiProperty({ default: ProjectPropertyTypeEnum.Residential, enum: ProjectPropertyTypeEnum })
  @IsEnum(ProjectPropertyTypeEnum)
  @IsOptional()
  readonly propertyType?: ProjectPropertyTypeEnum | null
}
