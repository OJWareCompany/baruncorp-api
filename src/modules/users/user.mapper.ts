import { Injectable } from '@nestjs/common'
import { Mapper } from '@libs/ddd/mapper.interface'
import { PositionResponseDto } from '@modules/department/dtos/position.response.dto'
import { OrganizationEntity } from '@modules/organization/domain/organization.entity'
import { ServiceResponseDto } from '@modules/department/dtos/service.response.dto'
import { UserEntity } from './domain/user.entity'
import { UserModel } from './database/user.repository'
import { UserName } from './domain/value-objects/user-name.vo'
import { UserRole } from './domain/value-objects/user-role.vo'
import { UserResponseDto } from './dtos/user.response.dto'
import { LincenseResponseDto } from './dtos/license.response.dto'

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
      address: copy.address,
      phoneNumber: copy.phoneNumber,
      isActiveWorkResource: copy.isActiveWorkResource,
      isCurrentUser: copy.isCurrentUser,
      isInactiveOrganizationUser: copy.isInactiveOrganizationUser,
      revenueShare: copy.revenueShare,
      revisionRevenueShare: copy.revisionRevenueShare,
      updatedBy: copy.updatedBy,
      type: copy.type,
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
        address: record.address,
        phoneNumber: record.phoneNumber,
        isActiveWorkResource: record.isActiveWorkResource,
        isCurrentUser: record.isCurrentUser,
        isInactiveOrganizationUser: record.isInactiveOrganizationUser,
        revenueShare: record.revenueShare,
        revisionRevenueShare: record.revisionRevenueShare,
        type: record.type,
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
