import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
import { JobNoteTypeEnum } from '../../domain/job-note.type'
import { Transform } from 'class-transformer'
import { processEmails } from '../../../../libs/utils/processEmails'

export class CreateJobNoteRequestDto {
  @ApiProperty({ default: 'hs8da-cdef-gh22321ask-xzcm12e3' })
  @IsString()
  readonly jobId: string

  @ApiProperty({ default: 'This is Job Note Content' })
  @IsString()
  readonly content: string

  @ApiProperty({ default: '<div class=......>hello world</div>' })
  @IsString()
  @IsOptional()
  readonly emailBody?: string

  @ApiProperty({ default: JobNoteTypeEnum.JobNote })
  @IsEnum(JobNoteTypeEnum)
  readonly type: JobNoteTypeEnum

  @ApiProperty({ default: ['yunwoo@oj.vision'] })
  @IsArray()
  @IsEmail({}, { each: true })
  // @Transform(({ value }) => processEmails(value))
  @IsOptional()
  readonly receiverEmails?: string[]

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  readonly files: any[]
}
