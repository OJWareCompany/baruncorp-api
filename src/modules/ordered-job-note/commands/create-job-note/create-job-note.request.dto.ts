import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'
import { JobNoteTypeEnum } from '../../domain/job-note.type'

export class CreateJobNoteRequestDto {
  @ApiProperty({ default: 'hs8da-cdef-gh22321ask-xzcm12e3' })
  @IsString()
  readonly jobId: string

  @ApiProperty({ default: 'This is Job Note Content' })
  @IsString()
  readonly content: string

  @ApiProperty({ default: JobNoteTypeEnum.JobNote })
  @IsEnum(JobNoteTypeEnum)
  readonly type: JobNoteTypeEnum

  @ApiProperty({ default: ['yunwoo@oj.vision'] })
  @IsArray()
  @IsString({ each: true })
  readonly receiverEmails: string[] | null
}
