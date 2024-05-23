import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateJobDueDateParamRequestDto {
  @ApiProperty({ default: 'a3c7e040-44ff-48c3-bbb8-9fb53024ba73' })
  @IsString()
  readonly jobId: string
}

export class UpdateJobDueDateRequestDto {
  @ApiProperty({ default: '2024-05-23T02:10:09.044Z' })
  @IsDate()
  @Type(() => Date)
  readonly dueDate: Date
}
