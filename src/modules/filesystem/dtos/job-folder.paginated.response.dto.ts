import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'

export class JobFolderPaginatedResponseFields {
  @ApiProperty({ example: '1-1Fk8UI8sz0yh-LV1QCCZ04K40ZHJK05' })
  id: string | null

  @ApiProperty({ example: '93b7-40db58e-d8c42-b391-1af41a7b6b63' })
  jobId: string | null

  @ApiProperty({ example: '0AN-3RUk9PVA7ZK0JGs' })
  sharedDriveId: string | null
}

export class JobFolderPaginatedResponseDto extends PaginatedResponseDto<JobFolderPaginatedResponseFields> {
  @ApiProperty({ type: JobFolderPaginatedResponseFields, isArray: true })
  readonly items: readonly JobFolderPaginatedResponseFields[]
}
