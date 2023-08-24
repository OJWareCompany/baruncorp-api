import { Injectable } from '@nestjs/common'
import { Mapper } from '@libs/ddd/mapper.interface'
import { UserRoleModel } from '../../modules/organization/database/organization.repository'
import { UserRole, UserRoles } from './domain/value-objects/user-role.vo'

export class UserRoleResponseDto {
  userId: string
  role: string
}

@Injectable()
export class UserRoleMapper implements Mapper<UserRole, UserRoleModel, UserRoleResponseDto> {
  toPersistence(entity: UserRole): UserRoleModel {
    const copy = entity.getProps()
    const record: UserRoleModel = {
      ...copy,
      updatedAt: new Date(),
      createdAt: new Date(),
    }
    return record
  }

  toDomain(record: UserRoleModel): UserRole {
    let role: UserRoles = UserRoles.guest
    if (record.role === 'domain') role = UserRoles.admin
    else if (record.role === 'manager') role = UserRoles.manager
    else if (record.role === 'member') role = UserRoles.member
    return new UserRole({ userId: record.userId, role })
  }

  toResponse(entity: UserRole, ...dtos: any): UserRoleResponseDto {
    const response = new UserRoleResponseDto()
    response.userId = entity.getProps().userId
    response.role = entity.getProps().role
    return response
  }
}
