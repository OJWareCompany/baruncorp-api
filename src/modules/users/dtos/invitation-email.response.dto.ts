import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsString } from 'class-validator'

export class InvitationEmailResponseDto {
  @ApiProperty()
  @IsString()
  email: string

  @ApiProperty()
  @IsString()
  role: string

  @ApiProperty()
  @IsString()
  organizationId: string

  @ApiProperty()
  @IsDate()
  updatedAt: Date

  @ApiProperty()
  @IsDate()
  createdAt: Date
}
