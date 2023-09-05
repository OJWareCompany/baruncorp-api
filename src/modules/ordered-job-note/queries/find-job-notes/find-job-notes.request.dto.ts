import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindJobNotesRequestDto {
  @ApiProperty()
  @IsString()
  jobId: string
}
