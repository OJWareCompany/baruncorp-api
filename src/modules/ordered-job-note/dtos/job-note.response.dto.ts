import { ApiProperty } from '@nestjs/swagger'
import { JobNoteTypeEnum } from '../domain/job-note.type'
import { Paginated } from '../../../libs/ddd/repository.port'
import { JobNoteDetailResponseDto } from './job-note-detail.response.dto'

export class JobNoteResponseDto {
  @ApiProperty({ default: 'a1918979-a454-4d83-8eb0-31195a5967c6' })
  clientOrganizationName: string

  @ApiProperty({ default: 'a1918979-a454-4d83-8eb0-31195a5967c6' })
  projectType: string

  @ApiProperty({ example: 'Chris Kim' })
  propertyAddress: string

  @ApiProperty({ example: 1 })
  jobRequestNumber: number

  @ApiProperty()
  data: JobNoteDetailResponseDto[]
}
