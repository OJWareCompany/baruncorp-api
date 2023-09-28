import { ApiProperty } from '@nestjs/swagger'
import { LincenseResponseDto } from './license.response.dto'
import { ServiceResponseDto } from './service.response.dto'
import { PositionResponseDto } from './position.response.dto'

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
  position: PositionResponseDto | null

  @ApiProperty()
  services: ServiceResponseDto[]

  @ApiProperty()
  licenses: LincenseResponseDto[]

  @ApiProperty()
  role: string

  @ApiProperty()
  deliverablesEmails: string[]
}
