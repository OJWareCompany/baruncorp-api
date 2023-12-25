import { Injectable } from '@nestjs/common'
import { Mapper } from '@libs/ddd/mapper.interface'
import { UserEntity } from './domain/user.entity'
import { UserModel, UserQueryModel } from './database/user.repository'
import { UserName } from './domain/value-objects/user-name.vo'
import { UserResponseDto } from './dtos/user.response.dto'
import { Phone } from './domain/value-objects/phone-number.value-object'
import { Organization } from './domain/value-objects/organization.value-object'
import { Position } from './domain/value-objects/position.value-object'
import { UserRoleNameEnum } from './domain/value-objects/user-role.vo'
import { AutoAssignmentTypeEnum } from '../position/domain/position.type'
import { UserStatusEnum } from './domain/user.types'
import { License } from './domain/value-objects/license.value-object'
import { LicenseTypeEnum } from '../license/dtos/license.response.dto'

@Injectable()
export default class UserMapper implements Mapper<UserEntity, UserModel, UserResponseDto> {
  toPersistence(entity: UserEntity): UserModel {
    const copy = entity.getProps()
    const record: UserModel = {
      id: copy.id,
      email: copy.email,
      firstName: copy.userName.getFirstName(),
      lastName: copy.userName.getLastName(),
      full_name: copy.userName.getFullName(),
      organizationId: copy.organization.id,
      updatedAt: new Date(),
      createdAt: new Date(),
      address: null,
      phoneNumber: copy.phone?.number || null,
      updatedBy: copy.updatedBy,
      type: copy.type,
      deliverables_emails: copy.deliverablesEmails.toString(),
      isActiveWorkResource: null,
      isCurrentUser: null,
      isInactiveOrganizationUser: null,
      revenueShare: null,
      revisionRevenueShare: null,
      isVendor: copy.isVendor,
      isHandRaisedForTask: copy.isHandRaisedForTask,
      status: copy.status,
    }
    return record
  }

  toDomain(record: UserQueryModel): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      props: {
        email: record.email,
        status: record.status as UserStatusEnum,
        userName: new UserName({ firstName: record.firstName, lastName: record.lastName }),
        organization: new Organization({
          id: record.organizationId,
          name: record.organization.name,
          organizationType: record.organization.organizationType,
        }),
        phone: record.phoneNumber ? new Phone({ number: record.phoneNumber }) : null,
        updatedBy: record.updatedBy,
        type: record.type,
        deliverablesEmails: record.deliverables_emails?.split(',') || [],
        position: record.userPosition
          ? new Position({ id: record.userPosition.positionId, name: record.userPosition.position.name })
          : null,
        licenses: record.licenses.map(
          (license) =>
            new License({
              type: license.type as LicenseTypeEnum,
              abbreviation: license.abbreviation,
              expiryDate: license.expiryDate,
              issuingCountryName: license.issuingCountryName,
              ownerName: license.userName,
            }),
        ),
        availableTasks: record.availableTasks.map((task) => {
          return {
            id: task.taskId,
            name: task.taskName,
            autoAssignmentType: task.autoAssignmentType as AutoAssignmentTypeEnum,
          }
        }),
        role: record.userRole?.roleName as UserRoleNameEnum,
        isVendor: record.isVendor,
        isHandRaisedForTask: record.isHandRaisedForTask,
      },
    })
    return entity
  }

  // ResponseDto is just a json.
  // when request through repository directly?
  toResponse(entity: UserEntity): UserResponseDto {
    const props = entity.getProps()
    const response = new UserResponseDto()
    response.id = props.id
    response.email = props.email
    response.firstName = props.userName.getFirstName()
    response.lastName = props.userName.getLastName()
    response.fullName = props.userName.getFullName()
    response.phoneNumber = props.phone?.number || null
    response.deliverablesEmails = props.deliverablesEmails
    response.organization = props.organization.name
    response.organizationId = props.organization.id
    response.position = props.position ? props.position.unpack() : null
    response.licenses = props.licenses.map((license) => ({
      ...license.unpack(),
      expiryDate: license.expiryDate?.toISOString() || null,
    }))
    response.role = props.role
    response.isVendor = props.isVendor
    response.availableTasks = props.availableTasks
    return response
  }
}
