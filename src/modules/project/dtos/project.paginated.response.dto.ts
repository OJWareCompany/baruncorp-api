import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/ddd/page.response.dto'
import { MountingTypeEnum } from '../domain/project.type'

export class ProjectPaginatedResponseFields {
  @ApiProperty({ example: 'Residential' })
  propertyType: string

  @ApiProperty({ example: 'https://host.com/projects/path' })
  projectFolderLink: string | null

  @ApiProperty({ example: null })
  projectNumber: string | null

  @ApiProperty({ example: '3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309' })
  propertyAddress: string

  @ApiProperty({ enum: MountingTypeEnum, example: 'Ground Mount' })
  mountingType: MountingTypeEnum

  @ApiProperty({ example: '2023-09-05T07:14:57.270Z' })
  createdAt: string

  @ApiProperty({ example: 1 })
  totalOfJobs: number

  @ApiProperty({ example: false, description: '필요한지 확인 필요' })
  masterLogUpload: boolean

  @ApiProperty({ example: false, description: '필요한지 확인 필요' })
  designOrPEStampPreviouslyDoneOnProjectOutSide: boolean
}

export class ProjectPaginatedResponseDto extends PaginatedResponseDto<ProjectPaginatedResponseFields> {
  @ApiProperty({ type: ProjectPaginatedResponseFields, isArray: true })
  readonly items: readonly ProjectPaginatedResponseFields[]
}
