import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator'
import { PasswordOption } from '../../users/domain/value-objects/password.vo'

export class SignUpRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly userId: string
}

export class SignUpRequestDto {
  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsEmail()
  readonly email: string

  @ApiProperty({ default: 'Emma' })
  @IsString()
  readonly firstName: string

  @ApiProperty({ default: 'Smith' })
  @IsString()
  readonly lastName: string

  @ApiProperty({ default: 'hyomin@ojware.com', type: String, isArray: true })
  @IsArray()
  readonly deliverablesEmails: string[]

  @ApiProperty({ default: 'thisistestPass123!' })
  @IsStrongPassword(PasswordOption)
  readonly password: string

  @ApiProperty({ default: '857-250-4567' })
  @IsString()
  @IsOptional()
  readonly phoneNumber: string | null
}
