import { ApiProperty } from '@nestjs/swagger'
import { UserRoleNameEnum } from '../../domain/value-objects/user-role.vo'
import { IsEnum, IsString } from 'class-validator'

export class ChangeUserRoleRequestDto {
  @ApiProperty({ default: UserRoleNameEnum.viewer })
  @IsEnum(UserRoleNameEnum)
  newRole: UserRoleNameEnum
}

export class ChangeUserRoleRequestParamDto {
  @ApiProperty()
  @IsString()
  userId: string
}
