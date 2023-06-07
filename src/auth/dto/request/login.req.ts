import { IsEmail, IsString } from 'class-validator'

export class LoginReq {
  @IsEmail()
  email: string

  @IsString()
  password: string
}
