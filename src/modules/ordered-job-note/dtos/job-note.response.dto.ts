import { ApiProperty } from '@nestjs/swagger'

export class JobNoteResponseDto {
  @ApiProperty()
  jobNoteId: string

  @ApiProperty({ example: 'what do you think about Jazz?' })
  content: string

  @ApiProperty()
  jobId: string

  @ApiProperty()
  commenterName: string

  @ApiProperty()
  commenterUserId: string

  @ApiProperty()
  createdAt: string
}

export class JobNoteListResponseDto {
  @ApiProperty({ type: JobNoteResponseDto })
  notes: JobNoteResponseDto[]
}
