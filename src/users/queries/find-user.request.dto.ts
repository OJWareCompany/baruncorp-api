import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional } from 'class-validator'

export class FindUserRqeustDto {
  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsOptional()
  @IsEmail()
  email?: string
}
