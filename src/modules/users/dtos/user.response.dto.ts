import { LincenseResponseDto } from './license.response.dto'
import { PositionResponseDto } from '../../department/dtos/position.response.dto'
import { ServiceResponseDto } from '../../department/dtos/service.response.dto'

export class UserResponseDto {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  organization: string | null
  organizationId: string | null
  position: PositionResponseDto | null
  services: ServiceResponseDto[] | null
  licenses: LincenseResponseDto[] | null
  role: string
}
