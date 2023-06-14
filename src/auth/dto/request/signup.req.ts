import { IsEmail, IsString, IsStrongPassword } from 'class-validator'
import { UserProp } from '../../../users/interfaces/user.interface'
import { PasswordOption } from '../../../users/vo/password.vo'

export class SignUpReq implements Omit<UserProp, 'id' | 'companyId'> {
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
