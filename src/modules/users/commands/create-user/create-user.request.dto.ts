import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, IsArray, IsOptional } from 'class-validator'

export class CreateUserRequestDto {
  @ApiProperty({ default: '07e12e89-6077-4fd1-a029-c50060b57f43' })
  @IsString()
  readonly organizationId: string

  @ApiProperty({ default: 'Emma' })
  @IsString()
  readonly firstName: string

  @ApiProperty({ default: 'Smith' })
  @IsString()
  readonly lastName: string

  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsEmail()
  readonly email: string

  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsArray()
  readonly deliverablesEmails: string[]

  @ApiProperty({ default: '857-250-4567' })
  @IsString()
  @IsOptional()
  readonly phoneNumber: string | null
}
