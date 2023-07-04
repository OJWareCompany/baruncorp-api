import { Mapper } from '../department/license.mapper'
import { OrganizationModel } from './database/organization.repository'
import { OrganizationEntity } from './entites/organization.entity'
import { Organizations } from '@prisma/client'
import { CreateOrganizationProps } from './interfaces/organization.interface'
import { Address } from './vo/address.vo'
import { Injectable } from '@nestjs/common'

export class OrganizationResponseDto {
  name: string
  description: string
  email: string
  phoneNumber: string
  organizationType: string
  city: string
  country: string
  postalCode: string
  stateOrRegion: string
  street1: string
  street2: string
}

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
      stateOrRegion: props.address.stateOrRegion,
      street1: props.address.street1,
      street2: props.address.street2,
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
        city: record.city,
        country: record.country,
        postalCode: record.postalCode,
        stateOrRegion: record.stateOrRegion,
        street1: record.street1,
        street2: record.street2,
      }),
    }
    return new OrganizationEntity({ id: record.id, props })
  }

  toResponse(entity: OrganizationEntity): OrganizationResponseDto {
    const response = new OrganizationResponseDto()
    response.name = entity.getProps().name
    response.description = entity.getProps().description
    response.email = entity.getProps().email
    response.phoneNumber = entity.getProps().phoneNumber
    response.organizationType = entity.getProps().organizationType
    response.city = entity.getProps().address.city
    response.country = entity.getProps().address.country
    response.postalCode = entity.getProps().address.postalCode
    response.stateOrRegion = entity.getProps().address.stateOrRegion
    response.street1 = entity.getProps().address.street1
    response.street2 = entity.getProps().address.street2
    return response
  }
}
