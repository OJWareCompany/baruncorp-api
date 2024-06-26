import { ApiProperty } from '@nestjs/swagger'
import { UserLicenseResponseDto } from './user-license.response.dto'
import { UserPositionResponseDto } from './user-position.response.dto'
import { AvailableTaskResponseDto } from './available-task.response.dto'
import { UserStatusEnum } from '../domain/user.types'
import { IsDate, IsEnum, IsOptional } from 'class-validator'

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
  licenses: UserLicenseResponseDto[]

  @ApiProperty()
  role: string

  @ApiProperty()
  deliverablesEmails: string[]

  @ApiProperty()
  isVendor: boolean

  @ApiProperty({ default: UserStatusEnum.ACTIVE })
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum

  @ApiProperty()
  @IsDate()
  @IsOptional()
  dateOfJoining: Date | null

  @ApiProperty()
  departmentId: string | null

  @ApiProperty()
  departmentName: string | null
}
