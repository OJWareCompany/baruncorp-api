import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateInvitationMailRequestDto {
  @ApiProperty({ default: 'OJ Tech' })
  @IsString()
  readonly organizationName: string

  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsString()
  readonly email: string
}
