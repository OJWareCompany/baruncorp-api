import { IsEmail, IsStrongPassword } from 'class-validator'
import { PasswordOption } from '../../../users/domain/value-objects/password.vo'
import { ApiProperty } from '@nestjs/swagger'

export class SignInRequestDto {
  @ApiProperty({ default: 'admin-test@baruncorp.com' })
  @IsEmail()
  readonly email: string

  @ApiProperty({ default: 'WkdWkdaos123!' })
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
