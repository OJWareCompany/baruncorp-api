import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindJobNotesPagenatedRequestDto {
  @ApiProperty()
  @IsString()
  jobId: string
}
