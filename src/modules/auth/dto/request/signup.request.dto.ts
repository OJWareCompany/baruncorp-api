import { IsArray, IsEmail, IsString, IsStrongPassword } from 'class-validator'
import { PasswordOption } from '../../../users/domain/value-objects/password.vo'
import { ApiProperty } from '@nestjs/swagger'

export class SignUpRequestDto {
  @ApiProperty({ default: 'Emma' })
  @IsString()
  readonly firstName: string

  @ApiProperty({ default: 'Smith' })
  @IsString()
  readonly lastName: string

  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsEmail()
  readonly email: string

  @ApiProperty({ default: 'hyomin@ojware.com', isArray: true })
  @IsArray()
  readonly deliverablesEmails: string[] | null

  @ApiProperty({ default: 'thisistestPass123!' })
  @IsStrongPassword(PasswordOption)
  readonly password: string

  @ApiProperty({ default: 'AE2DE' })
  @IsString()
  readonly code: string

  @ApiProperty({ default: '176 Morningmist Road, Naugatuck, Connecticut 06770' })
  @IsString()
  address: string

  @ApiProperty({ default: '857-250-4567' })
  @IsString()
  phoneNumber: string

  @ApiProperty({ default: true })
  @IsString()
  isActiveWorkResource: boolean

  @ApiProperty({ default: true })
  @IsString()
  isCurrentUser: boolean

  @ApiProperty({ default: true })
  @IsString()
  isInactiveOrganizationUser: boolean

  @ApiProperty({ default: true })
  @IsString()
  isRevenueShare: boolean

  @ApiProperty({ default: true })
  @IsString()
  isRevisionRevenueShare: boolean

  @ApiProperty({ default: 'CLIENT' })
  @IsString()
  type: string
}
