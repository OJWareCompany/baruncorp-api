import { OrganizationModel } from './database/organization.repository'
import { Organizations } from '@prisma/client'
import { Address } from './domain/value-objects/address.vo'
import { Injectable } from '@nestjs/common'
import { OrganizationEntity } from './domain/organization.entity'
import { CreateOrganizationProps } from './domain/organization.types'
import { OrganizationResponseDto } from './dtos/organization.response.dto'
import { Mapper } from '@libs/ddd/mapper.interface'

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
      description: props.description,
      organizationType: props.organizationType,
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
      email: record.email,
      phoneNumber: record.phoneNumber,
      organizationType: record.organizationType,
      address: new Address({
        fullAddress: `${record.street1}, ${record.city}, ${record.stateOrRegion} ${record.postalCode}`,
        city: record.city,
        country: record.country,
        postalCode: record.postalCode,
        state: record.stateOrRegion,
        street1: record.street1,
        street2: record.street2,
        coordinates: [],
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
    response.city = entity.getProps().address.city
    response.country = entity.getProps().address.country
    response.postalCode = entity.getProps().address.postalCode
    response.state = entity.getProps().address.state
    response.street1 = entity.getProps().address.street1
    response.street2 = entity.getProps().address.street2
    response.isActiveContractor = entity.getProps().isActiveContractor
    response.isActiveWorkResource = entity.getProps().isActiveWorkResource
    response.isRevenueShare = entity.getProps().isRevenueShare
    response.isRevisionRevenueShare = entity.getProps().isRevisionRevenueShare
    response.invoiceRecipient = entity.getProps().invoiceRecipient
    response.invoiceRecipientEmail = entity.getProps().invoiceRecipientEmail
    return response
  }
}
