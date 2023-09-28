import { ApiProperty } from '@nestjs/swagger'
import { LincenseResponseDto } from './license.response.dto'
import { UserServiceResponseDto } from './user-service.response.dto'
import { UserPositionResponseDto } from './user-position.response.dto'

export class UserResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  email: string

  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  fullName: string

  @ApiProperty()
  phoneNumber: string | null

  @ApiProperty()
  organization: string

  @ApiProperty()
  organizationId: string

  @ApiProperty()
  position: UserPositionResponseDto | null

  @ApiProperty()
  services: UserServiceResponseDto[]

  @ApiProperty()
  licenses: LincenseResponseDto[]

  @ApiProperty()
  role: string

  @ApiProperty()
  deliverablesEmails: string[]
}
