import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'

export class FindUserRqeustDto {
  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsString()
  organizationId?: string
}
