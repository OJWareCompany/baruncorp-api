import { IsEmail, IsString, IsStrongPassword } from 'class-validator'
import { PasswordOption } from '../../../users/vo/password.vo'

export class SignUpReq {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsEmail()
  email: string

  @IsStrongPassword(PasswordOption)
  password: string

  @IsString()
  code: string
}
