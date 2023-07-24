import { IsEmail, IsString, IsStrongPassword, Matches } from 'class-validator'
import { PasswordOption } from '../../../users/vo/password.vo'

export class LoginReq {
  @IsEmail()
  readonly email: string

  @IsStrongPassword(PasswordOption, { message: '10111' })
  readonly password: string

  // constructor() {}

  // getEmail(): EmailVO {
  //   return new EmailVO(this.email)
  // }

  // getPassword(): InputPasswordVO {
  //   return new InputPasswordVO(this.password)
  // }
}
