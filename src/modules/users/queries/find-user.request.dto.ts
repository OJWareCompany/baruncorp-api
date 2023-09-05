import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'

export class FindUserRqeustDto {
  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsOptional()
  @IsEmail()
  readonly email?: string | null

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsString()
  readonly organizationId?: string | null
}
