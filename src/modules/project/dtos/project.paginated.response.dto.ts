import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/ddd/page.response.dto'

export class ProjectPaginatedResponseFields {
  @ApiProperty({ example: 'Residential' })
  propertyType: string

  @ApiProperty({ example: 'https://host.com/projects/path' })
  projectFolderLink: string | null

  @ApiProperty({ example: null })
  projectNumber: string | null

  @ApiProperty({ example: '3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309' })
  propertyAddress: string

  @ApiProperty({ example: new Date() })
  createdAt: string

  @ApiProperty({ example: 1 })
  totalOfJobs: number

  @ApiProperty({ example: false })
  masterLogUpload: boolean

  @ApiProperty({ example: false })
  designOrPEStampPreviouslyDoneOnProjectOutSide: boolean
}

export class ProjectPaginatedResponseDto extends PaginatedResponseDto<ProjectPaginatedResponseFields> {
  @ApiProperty({ type: ProjectPaginatedResponseFields, isArray: true })
  readonly items: readonly ProjectPaginatedResponseFields[]
}
