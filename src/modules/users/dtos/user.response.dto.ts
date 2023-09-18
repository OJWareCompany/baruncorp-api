import { LincenseResponseDto } from './license.response.dto'
import { PositionResponseDto } from '../../department/dtos/position.response.dto'
import { ServiceResponseDto } from '../../department/dtos/service.response.dto'
import { ApiProperty } from '@nestjs/swagger'

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
