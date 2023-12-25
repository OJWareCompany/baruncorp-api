import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString, isEnum } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'

export class AssigningTaskAlertResponse {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  userId: string

  @ApiProperty()
  @IsString()
  userName: string

  @ApiProperty()
  @IsString()
  assignedTaskId: string

  @ApiProperty()
  @IsString()
  taskName: string

  @ApiProperty()
  @IsString()
  jobId: string

  @ApiProperty()
  @IsEnum(ProjectPropertyTypeEnum)
  projectPropertyType: ProjectPropertyTypeEnum

  @ApiProperty()
  @IsString()
  @IsEnum(MountingTypeEnum)
  mountingType: MountingTypeEnum

  @ApiProperty()
  @IsBoolean()
  isRevision: boolean

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string | null

  @ApiProperty()
  @IsString()
  createdAt: Date
}

export class AssigningTaskAlertPaginatedResponse extends PaginatedResponseDto<AssigningTaskAlertResponse> {
  @ApiProperty({ type: AssigningTaskAlertResponse, isArray: true })
  items: readonly AssigningTaskAlertResponse[]
}
