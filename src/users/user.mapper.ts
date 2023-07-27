import { Mapper } from '../department/license.mapper'
import { UserEntity } from './domain/user.entity'
import { UserModel } from './database/user.repository'
import { UserResponseDto } from './dtos/user.response.dto'
import { UserName } from './domain/value-objects/user-name.vo'
import { LincenseResponseDto } from './dtos/license.response.dto'
import { PositionResponseDto } from '../department/dtos/position.response.dto'
import { Injectable } from '@nestjs/common'
import { ServiceResponseDto } from '../department/service.mapper'
import { UserRole } from './domain/value-objects/user-role.vo'
import { OrganizationEntity } from '../organization/domain/organization.entity'

@Injectable()
export default class UserMapper implements Mapper<UserEntity, UserModel, UserResponseDto> {
  toPersistence(entity: UserEntity): UserModel {
    const copy = entity.getProps()
    const record: UserModel = {
      id: copy.id,
      email: copy.email,
      firstName: copy.userName.getFirstName(),
      lastName: copy.userName.getLastName(),
      organizationId: copy.organizationId,
      updatedAt: new Date(),
      createdAt: new Date(),
    }
    return record
  }

  toDomain(record: UserModel): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      props: {
        email: record.email,
        userName: new UserName({ firstName: record.firstName, lastName: record.lastName }),
        organizationId: record.organizationId,
      },
    })
    return entity
  }

  // ResponseDto is just a json.
  // when request through repository directly?
  toResponse(
    entity: UserEntity,
    role: UserRole,
    organizationEntity: OrganizationEntity,
    position: PositionResponseDto,
    services: ServiceResponseDto[],
    licenses: LincenseResponseDto[],
  ): UserResponseDto {
    const props = entity.getProps()
    const response = new UserResponseDto()
    response.id = props.id
    response.email = props.email
    response.firstName = props.userName.getFirstName()
    response.lastName = props.userName.getLastName()
    response.fullName = props.userName.getFullName()
    response.organization = organizationEntity.getProps().name
    response.services = services
    response.position = position
    response.licenses = licenses
    response.role = role?.getProps().role || null
    return response
  }
}
