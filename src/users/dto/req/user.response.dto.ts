import { ServiceResponseDto } from '../../../department/service.mapper'
import { LincenseResponseDto } from '../../../department/dto/license.response.dto'
import { PositionResponseDto } from '../../../department/dto/position.response.dto'

export class UserResponseDto {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  organization: string
  position: PositionResponseDto
  services: ServiceResponseDto[]
  licenses: LincenseResponseDto[]
  role: string
}
