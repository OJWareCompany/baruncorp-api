import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UserRequestDto {
  @ApiProperty({ default: '96d39061-a4d7-4de9-a147-f627467e11d5' })
  @IsString()
  userId: string
}
