import { IsArray, IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator'
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

  @ApiProperty({ default: 'hyomin@ojware.com', type: String, isArray: true })
  @IsArray()
  readonly deliverablesEmails: string[]

  @ApiProperty({ default: 'thisistestPass123!' })
  @IsStrongPassword(PasswordOption)
  readonly password: string

  @ApiProperty({ default: 'AE2DE' })
  @IsString()
  readonly code: string

  @ApiProperty({ default: '176 Morningmist Road, Naugatuck, Connecticut 06770' })
  @IsString()
  @IsOptional()
  readonly address: string | null

  @ApiProperty({ default: '857-250-4567' })
  @IsString()
  readonly phoneNumber: string

  @ApiProperty({ default: true, description: '필요한지 확인 필요' })
  @IsString()
  readonly isActiveWorkResource: boolean

  @ApiProperty({ default: true, description: '필요한지 확인 필요' })
  @IsString()
  readonly isCurrentUser: boolean

  @ApiProperty({ default: true, description: '필요한지 확인 필요' })
  @IsString()
  readonly isInactiveOrganizationUser: boolean

  @ApiProperty({ default: true, description: '필요한지 확인 필요' })
  @IsString()
  readonly isRevenueShare: boolean

  @ApiProperty({ default: true, description: '필요한지 확인 필요' })
  @IsString()
  readonly isRevisionRevenueShare: boolean
}
