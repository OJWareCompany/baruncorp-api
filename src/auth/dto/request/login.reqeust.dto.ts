import { IsEmail, IsStrongPassword } from 'class-validator'
import { PasswordOption } from '../../../users/domain/value-objects/password.vo'
import { ApiProperty } from '@nestjs/swagger'

export class SignInRequestDto {
  @IsEmail()
  @ApiProperty({ default: 'ejsvk3284@kakao.com' })
  readonly email: string

  @IsStrongPassword(PasswordOption, { message: '10111' })
  @ApiProperty({ default: 'WkdWkdaos123!' })
  readonly password: string

  // constructor() {}

  // getEmail(): EmailVO {
  //   return new EmailVO(this.email)
  // }

  // getPassword(): InputPasswordVO {
  //   return new InputPasswordVO(this.password)
  // }
}
