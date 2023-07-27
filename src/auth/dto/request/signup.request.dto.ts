import { IsEmail, IsString, IsStrongPassword } from 'class-validator'
import { PasswordOption } from '../../../users/domain/value-objects/password.vo'
import { ApiProperty } from '@nestjs/swagger'

export class SignUpRequestDto {
  @IsString()
  @ApiProperty({ default: 'Emma' })
  firstName: string

  @IsString()
  @ApiProperty({ default: 'Smith' })
  lastName: string

  @IsEmail()
  email: string

  @IsStrongPassword(PasswordOption)
  password: string

  @IsString()
  code: string
}
