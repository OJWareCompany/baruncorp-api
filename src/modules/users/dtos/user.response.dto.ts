import { ApiProperty } from '@nestjs/swagger'
import { LicenseResponseDto } from './license.response.dto'
import { UserPositionResponseDto } from './user-position.response.dto'
import { AvailableTaskResponseDto } from './available-task.response.dto'
import { UserStatusEnum } from '../domain/user.types'
import { IsEnum } from 'class-validator'

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
  availableTasks: AvailableTaskResponseDto[]

  @ApiProperty()
  licenses: LicenseResponseDto[]

  @ApiProperty()
  role: string

  @ApiProperty()
  deliverablesEmails: string[]

  @ApiProperty()
  isVendor: boolean

  @ApiProperty({ default: UserStatusEnum.ACTIVE })
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum
}
