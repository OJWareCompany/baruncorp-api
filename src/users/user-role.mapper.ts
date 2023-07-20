import { Mapper } from '../department/license.mapper'
import { UserRoleEntity } from './entities/user-role.entity'
import { UserRoleModel } from '../organization/database/organization.repository'
import { UserRoles } from './interfaces/user-role.interface'
import { Injectable } from '@nestjs/common'

export class UserRoleResponseDto {
  userId: string
  role: string
}

@Injectable()
export class UserRoleMapper implements Mapper<UserRoleEntity, UserRoleModel, UserRoleResponseDto> {
  toPersistence(entity: UserRoleEntity): UserRoleModel {
    const copy = entity.getProps()
    const record: UserRoleModel = {
      ...copy,
      updatedAt: new Date(),
      createdAt: new Date(),
    }
    return record
  }

  toDomain(record: UserRoleModel): UserRoleEntity {
    let role: UserRoles = UserRoles.guest
    if (record.role === 'domain') role = UserRoles.admin
    else if (record.role === 'manager') role = UserRoles.manager
    else if (record.role === 'member') role = UserRoles.member
    return new UserRoleEntity({ userId: record.userId, role })
  }

  toResponse(entity: UserRoleEntity, ...dtos: any): UserRoleResponseDto {
    const response = new UserRoleResponseDto()
    response.userId = entity.getProps().userId
    response.role = entity.getProps().role
    return response
  }
}
