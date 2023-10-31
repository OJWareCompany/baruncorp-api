import { IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignUpTestRequestDto {
  @ApiProperty({ default: 'Emma' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsEmail()
  readonly email: string
}
