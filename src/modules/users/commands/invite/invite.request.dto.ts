import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class InviteRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly organizationId: string

  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsString()
  readonly email: string
}
