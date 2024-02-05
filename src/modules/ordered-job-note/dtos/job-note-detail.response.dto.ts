import { ApiProperty } from '@nestjs/swagger'
import { JobNoteTypeEnum } from '../domain/job-note.type'

export class JobNoteDetailResponseDto {
  @ApiProperty({ default: 'a1918979-a454-4d83-8eb0-31195a5967c6' })
  id: string

  @ApiProperty({ default: JobNoteTypeEnum.JobNote })
  type: JobNoteTypeEnum

  @ApiProperty({ example: 'Chris Kim' })
  creatorName: string

  @ApiProperty({ example: 'what do you think about Jazz?' })
  content: string

  @ApiProperty({ default: 1 })
  jobNoteNumber: number

  @ApiProperty({ default: 'yunwoo@oj.vision' })
  senderMail: string | null

  @ApiProperty({ default: ['yunwoo@oj.vision'] })
  receiverMails: string[] | null

  @ApiProperty({ default: ['https://drive.google.com/drive/folders/1MFhV8NTBNsPM3pvfBz6UKKTdKntXfWd7'] })
  fileShareLink: string | null

  @ApiProperty()
  createdAt: Date
}
