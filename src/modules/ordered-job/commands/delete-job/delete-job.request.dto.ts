import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteJobRequestDto {
  @ApiProperty({ default: '084011c5-bf0e-4279-9df5-9af751f5bd15' })
  @IsString()
  readonly jobId: string
}
