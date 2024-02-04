import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { AssignedTaskStatusEnum } from '../../domain/assigned-task.type'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { DESCRIPTION } from '../../../ordered-job/queries/find-job-paginated/find-job.paginated.request.dto'
import { Transform, Type } from 'class-transformer'

export class FindAssignedTaskSummaryPaginatedRequestDto {
  @ApiProperty({ default: 'Barun Corp', required: false })
  @IsString()
  @IsOptional()
  readonly organizationName?: string

  @ApiProperty({ default: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  readonly userName?: string

  @ApiProperty({ default: '2024-01-05', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly startedAt?: Date

  @ApiProperty({ default: '2025-01-06', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly endedAt?: Date
}
