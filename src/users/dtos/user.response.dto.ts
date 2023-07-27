import { ServiceResponseDto } from '../../department/service.mapper'
import { LincenseResponseDto } from './license.response.dto'
import { PositionResponseDto } from '../../department/dtos/position.response.dto'

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
