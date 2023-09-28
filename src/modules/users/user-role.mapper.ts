import { Injectable } from '@nestjs/common'
import { Mapper } from '@libs/ddd/mapper.interface'
import { UserRoleModel } from '../../modules/organization/database/organization.repository'
import { UserRole, UserRoleNameEnum } from './domain/value-objects/user-role.vo'

export class UserRoleResponseDto {
  userId: string
  role: string
}

@Injectable()
export class UserRoleMapper implements Mapper<UserRole, UserRoleModel, UserRoleResponseDto> {
  toPersistence(entity: UserRole): UserRoleModel {
    const copy = entity.unpack()
    const record: UserRoleModel = {
      ...copy,
      updatedAt: new Date(),
      createdAt: new Date(),
    }
    return record
  }

  toDomain(record: UserRoleModel): UserRole {
    let role: UserRoleNameEnum = UserRoleNameEnum.guest
    if (record.roleName === 'domain') role = UserRoleNameEnum.admin
    else if (record.roleName === 'manager') role = UserRoleNameEnum.manager
    else if (record.roleName === 'member') role = UserRoleNameEnum.member
    return new UserRole({ userId: record.userId, roleName: role })
  }

  toResponse(entity: UserRole, ...dtos: any): UserRoleResponseDto {
    const response = new UserRoleResponseDto()
    response.userId = entity.userId
    response.role = entity.name
    return response
  }
}
