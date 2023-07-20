import { Mapper } from '../department/license.mapper'
import { UserEntity } from './entities/user.entity'
import { UserModel } from './database/user.repository'
import { UserResponseDto } from './dto/req/user.response.dto'
import { UserName } from './vo/user-name.vo'
import { LincenseResponseDto } from '../department/dto/license.response.dto'
import { PositionResponseDto } from '../department/dto/position.response.dto'
import { UserRoleEntity } from './entities/user-role.entity'
import { Injectable } from '@nestjs/common'
import { OrganizationEntity } from '../organization/entites/organization.entity'
import { ServiceResponseDto } from '../department/service.mapper'

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
    role: UserRoleEntity,
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
