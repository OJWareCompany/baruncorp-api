import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateJobNoteRequestDto {
  @ApiProperty({ default: 'what do you think about Jazz?' })
  @IsString()
  readonly content: string

  @ApiProperty({ default: 'hs8da-cdef-gh22321ask-xzcm12e3' })
  @IsString()
  readonly jobId: string
}
