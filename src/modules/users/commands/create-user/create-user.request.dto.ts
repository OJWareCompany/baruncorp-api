import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsEmail, IsArray, IsOptional, IsBoolean, IsDate } from 'class-validator'

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

  @ApiProperty({ default: true })
  @IsBoolean()
  readonly isVendor: boolean

  @ApiProperty({ default: 'hyomin@ojware.com', type: String, isArray: true })
  @IsArray()
  readonly deliverablesEmails: string[]

  @ApiProperty({ default: '857-250-4567' })
  @IsString()
  @IsOptional()
  readonly phoneNumber: string | null

  @ApiProperty({ default: '2023-09-04T07:31:27.217Z' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readonly dateOfJoining?: Date | null
}
