import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'
import { JobNoteTypeEnum } from '../domain/job-note.type'

export class CreateJobNoteResponseDto {
  @ApiProperty({ default: 'a1918979-a454-4d83-8eb0-31195a5967c6' })
  id: string

  @ApiProperty({ default: 1 })
  jobNoteNumber: number

  @ApiProperty({ default: 'a1918979-a454-4d83-8eb0-31195a5967c6' })
  jobNoteFolderId: string | null
}
