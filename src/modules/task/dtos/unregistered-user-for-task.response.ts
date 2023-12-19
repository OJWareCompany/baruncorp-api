import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UnregisteredUserForTaskResponseDto {
  @ApiProperty()
  @IsString()
  userId: string

  @ApiProperty()
  @IsString()
  userName: string
}
