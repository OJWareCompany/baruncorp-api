import { Reflector } from '@nestjs/core'
import { UserRoleNameEnum } from '../../users/domain/value-objects/user-role.vo'

export const Roles = Reflector.createDecorator<UserRoleNameEnum[]>()
