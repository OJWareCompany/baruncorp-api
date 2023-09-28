import { OrganizationModel } from './database/organization.repository'
import { Organizations } from '@prisma/client'
import { Address } from './domain/value-objects/address.vo'
import { Injectable } from '@nestjs/common'
import { OrganizationEntity } from './domain/organization.entity'
import { CreateOrganizationProps } from './domain/organization.types'
import { OrganizationResponseDto } from './dtos/organization.response.dto'
import { Mapper } from '@libs/ddd/mapper.interface'
import { MountingType, ProjectPropertyType } from '../project/domain/project.type'
import { OrganizationPaginatedResponseFields } from './dtos/organization.paginated.response.dto'

/**
 * 여기서는 왜.. 경로 설정이 되는거지?
 */

/**
 * 도메인 api 구현 순서
 * 1. Model
 * 2. Entity
 * 3. Mapper (Entity, Model, ResponseDto)
 * 4. Service (여기서부터는 취향껏)
 * 5. Reposi
 * 6. Controller
 */
@Injectable()
export class OrganizationMapper implements Mapper<OrganizationEntity, OrganizationModel, OrganizationResponseDto> {
  toPersistence(entity: OrganizationEntity): Organizations {
    const props = entity.getProps()
    const record: OrganizationModel = {
      id: props.id,
      name: props.name,
      fullAddress: props.address.fullAddress.toString(),
      addressCoordinates: props.address.coordinates.toString(),
      description: props.description,
      organizationType: props.organizationType,
      mountingTypeDefaultValue: props.mountingTypeDefaultValue,
      projectPropertyTypeDefaultValue: props.projectPropertyTypeDefaultValue,
      email: props.email,
      phoneNumber: props.phoneNumber,
      city: props.address.city,
      country: props.address.country,
      postalCode: props.address.postalCode,
      stateOrRegion: props.address.state,
      street1: props.address.street1,
      street2: props.address.street2,
      updatedAt: new Date(),
      createdAt: new Date(),
      isActiveContractor: props.isActiveContractor ? 1 : 0,
      isActiveWorkResource: props.isActiveWorkResource ? 1 : 0,
      revenueShare: props.isRevenueShare ? 1 : 0,
      revisionRevenueShare: props.isRevisionRevenueShare ? 1 : 0,
      invoiceRecipient: props.invoiceRecipient,
      invoiceRecipientEmail: props.invoiceRecipientEmail,
    }
    return record
  }

  toDomain(record: OrganizationModel): OrganizationEntity {
    const props: CreateOrganizationProps = {
      name: record.name,
      description: record.description,
      mountingTypeDefaultValue: record.mountingTypeDefaultValue as MountingType,
      projectPropertyTypeDefaultValue: record.projectPropertyTypeDefaultValue as ProjectPropertyType,
      email: record.email,
      phoneNumber: record.phoneNumber,
      organizationType: record.organizationType,
      address: new Address({
        fullAddress: record.fullAddress,
        coordinates: record.addressCoordinates.split(',').map((n) => Number(n)),
        state: record.stateOrRegion,
        city: record.city,
        country: record.country,
        street1: record.street1,
        street2: record.street2,
        postalCode: record.postalCode,
      }),
      isActiveContractor: !!record.isActiveContractor,
      isActiveWorkResource: !!record.isActiveWorkResource,
      isRevenueShare: !!record.revenueShare,
      isRevisionRevenueShare: !!record.revisionRevenueShare,
      invoiceRecipient: record.invoiceRecipient,
      invoiceRecipientEmail: record.invoiceRecipientEmail,
    }
    return new OrganizationEntity({ id: record.id, props })
  }

  toResponse(entity: OrganizationEntity): OrganizationResponseDto {
    const response = new OrganizationResponseDto()
    response.id = entity.getProps().id
    response.name = entity.getProps().name
    response.description = entity.getProps().description
    response.email = entity.getProps().email
    response.phoneNumber = entity.getProps().phoneNumber
    response.organizationType = entity.getProps().organizationType
    response.address = new Address({
      city: entity.getProps().address.city,
      country: entity.getProps().address.country,
      postalCode: entity.getProps().address.postalCode,
      state: entity.getProps().address.state,
      street1: entity.getProps().address.street1,
      street2: entity.getProps().address.street2,
      coordinates: entity.getProps().address.coordinates,
      fullAddress: entity.getProps().address.fullAddress,
    })

    response.mountingTypeDefaultValue = entity.getProps().mountingTypeDefaultValue
    response.projectPropertyTypeDefaultValue = entity.getProps().projectPropertyTypeDefaultValue
    // response.isActiveContractor = entity.getProps().isActiveContractor
    // response.isActiveWorkResource = entity.getProps().isActiveWorkResource
    // response.isRevenueShare = entity.getProps().isRevenueShare
    // response.isRevisionRevenueShare = entity.getProps().isRevisionRevenueShare
    // response.invoiceRecipient = entity.getProps().invoiceRecipient
    // response.invoiceRecipientEmail = entity.getProps().invoiceRecipientEmail
    return response
  }
  toPaginatedResponse(entity: OrganizationEntity): OrganizationPaginatedResponseFields {
    const response = new OrganizationPaginatedResponseFields()
    response.id = entity.getProps().id
    response.name = entity.getProps().name
    response.description = entity.getProps().description
    response.email = entity.getProps().email
    response.phoneNumber = entity.getProps().phoneNumber
    response.organizationType = entity.getProps().organizationType
    response.fullAddress = entity.getProps().address.fullAddress
    response.mountingTypeDefaultValue = entity.getProps().mountingTypeDefaultValue
    response.projectPropertyTypeDefaultValue = entity.getProps().projectPropertyTypeDefaultValue
    // response.isActiveContractor = entity.getProps().isActiveContractor
    // response.isActiveWorkResource = entity.getProps().isActiveWorkResource
    // response.isRevenueShare = entity.getProps().isRevenueShare
    // response.isRevisionRevenueShare = entity.getProps().isRevisionRevenueShare
    // response.invoiceRecipient = entity.getProps().invoiceRecipient
    // response.invoiceRecipientEmail = entity.getProps().invoiceRecipientEmail
    return response
  }
}
