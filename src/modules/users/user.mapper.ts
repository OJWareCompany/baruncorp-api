import { Injectable } from '@nestjs/common'
import { Mapper } from '@libs/ddd/mapper.interface'
import { UserEntity } from './domain/user.entity'
import { UserModel, UserQueryModel } from './database/user.repository'
import { UserName } from './domain/value-objects/user-name.vo'
import { UserResponseDto } from './dtos/user.response.dto'
import { Phone } from './domain/value-objects/phone-number.value-object'
import { Organization } from './domain/value-objects/organization.value-object'
import { Position } from './domain/value-objects/position.value-object'
import { License } from './domain/value-objects/license.value-object'
import { Service } from './domain/value-objects/service.value-object'
import { Task } from './domain/value-objects/task.value-object'
import { LicenseType } from './user-license.type'
import { UserRoleNameEnum } from './domain/value-objects/user-role.vo'

@Injectable()
export default class UserMapper implements Mapper<UserEntity, UserModel, UserResponseDto> {
  toPersistence(entity: UserEntity): UserModel {
    const copy = entity.getProps()
    const record: UserModel = {
      id: copy.id,
      email: copy.email,
      firstName: copy.userName.getFirstName(),
      lastName: copy.userName.getLastName(),
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
    }
    return record
  }

  toDomain(record: UserQueryModel): UserEntity {
    const userElectricalLicenses = record.userElectricalLicenses.map(
      (elecLicense) =>
        new License({
          type: LicenseType.Electrical,
          ownerName: record.firstName + ' ' + record.lastName,
          issuingCountryName: elecLicense.issuingCountryName,
          abbreviation: elecLicense.abbreviation,
          priority: elecLicense.priority,
          expiryDate: elecLicense.expiryDate,
        }),
    )

    const userStructuralLicenses = record.userStructuralLicenses.map(
      (elecLicense) =>
        new License({
          type: LicenseType.Structural,
          ownerName: record.firstName + ' ' + record.lastName,
          issuingCountryName: elecLicense.issuingCountryName,
          abbreviation: elecLicense.abbreviation,
          priority: elecLicense.priority,
          expiryDate: elecLicense.expiryDate,
        }),
    )

    const services = record.userServices.map(
      (userService) =>
        new Service({
          id: userService.serviceId,
          name: userService.service.name,
          billingCode: userService.service.billingCode,
          basePrice: Number(userService.service.basePrice),
          relatedTasks: userService.service.tasks.map(
            (task) =>
              new Task({
                id: task.id,
                name: task.name,
              }),
          ),
        }),
    )

    const role: UserRoleNameEnum =
      record.userRole?.roleName === 'admin'
        ? UserRoleNameEnum.admin
        : record.userRole?.roleName === 'manager'
        ? UserRoleNameEnum.manager
        : record.userRole?.roleName === 'member'
        ? UserRoleNameEnum.member
        : record.userRole?.roleName === 'client'
        ? UserRoleNameEnum.client
        : UserRoleNameEnum.guest

    const entity = new UserEntity({
      id: record.id,
      props: {
        email: record.email,
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
        licenses: [...userElectricalLicenses, ...userStructuralLicenses],
        services: services,
        role: role,
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
    response.services = props.services.map((service) => ({
      ...service.unpack(),
      relatedTasks: service.relatedTasks.map((task) => task.unpack()),
    }))
    response.position = props.position ? props.position.unpack() : null
    response.licenses = props.licenses.map((license) => ({
      ...license.unpack(),
      expiryDate: license.expiryDate?.toISOString() || null,
    }))
    response.role = props.role
    return response
  }
}
