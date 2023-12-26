import { Mapper } from '../../libs/ddd/mapper.interface'
import { ProjectEntity } from './domain/project.entity'
import { Prisma, OrderedProjects } from '@prisma/client'
import { ProjectResponseDto } from './dtos/project.response.dto'
import { Address } from '../organization/domain/value-objects/address.vo'
import { ProjectAssociatedRegulatoryBody } from './domain/value-objects/project-associated-regulatory-body.value-object'
import { MountingType, ProjectPropertyType } from './domain/project.type'
import { Injectable } from '@nestjs/common'

/**
 * Entity, DB Record, Response DTO의 변환을 책임지는 클래스.
 * 변환을 한 곳에 묶어 관리하기 용이하다.
 */

@Injectable()
export class ProjectMapper implements Mapper<ProjectEntity, OrderedProjects, ProjectResponseDto> {
  toPersistence(entity: ProjectEntity): OrderedProjects {
    const props = entity.getProps()

    return {
      id: entity.id,
      organizationName: props.organizationName,
      projectNumber: props.projectNumber,
      propertyFullAddress: props.projectPropertyAddress.fullAddress,
      propertyAddressStreet1: props.projectPropertyAddress.street1,
      propertyAddressStreet2: props.projectPropertyAddress.street2,
      propertyAddressCity: props.projectPropertyAddress.city,
      propertyAddressState: props.projectPropertyAddress.state,
      propertyAddressPostalCode: props.projectPropertyAddress.postalCode,
      propertyAddressCoordinates: String(props.projectPropertyAddress.coordinates),
      propertyAddressCountry: props.projectPropertyAddress.country,
      propertyOwnerName: props.projectPropertyOwner,
      mailingAddressForWetStamps: props.mailingFullAddressForWetStamp,
      projectPropertyType: props.projectPropertyType,
      systemSize: props.systemSize ? new Prisma.Decimal(props.systemSize) : null,
      updatedAt: new Date(),
      dateCreated: new Date(),
      hasHistoryElectricalPEStamp: entity.getProps().hasHistoryElectricalPEStamp,
      hasHistoryStructuralPEStamp: entity.getProps().hasHistoryStructuralPEStamp,

      mountingType: props.mountingType,

      designOrPeStampPreviouslyDoneOnProjectOutside: 0, // TODO
      totalOfJobs: props.totalOfJobs,

      clientOrganizationId: props.clientOrganizationId,
      lastModifiedBy: props.updatedBy,

      // clientUserId: props.clientOrganizationId,
      // clientUserName: props.clientUserName,

      stateId: props.projectAssociatedRegulatory.stateId,
      countyId: props.projectAssociatedRegulatory.countyId || null, // undefined가 아닌 null이어야한다.
      countySubdivisionsId: props.projectAssociatedRegulatory.countySubdivisionsId || null,
      placeId: props.projectAssociatedRegulatory.placeId || null,
      ahjId: props.projectAssociatedRegulatory.ahjId || null,

      ahjAutomationLastRunDate: null,

      isGroundMount: null, // TODO: REMOVE
      mailingAddressForStructuralWetStamp: null,
      mailingAddressForElectricalWetStamp: null,
      projectFolder: null,
      masterLogUpload: null,
      ahjAutomationComplete: null,
      exportId: null,
      googleGeocoder: null,
      reTriggerActivateCreateProjectFolderTrigger: null,
      newBatteryStorageDesign: null,
      numberOfWetStamps: null,
      numberOfStructuralWetStamps: null,
      numberOfElectricalWetStamps: null,
      googleDriveClientAccountActiveFolderId: null,
      sandboxCheckbox: null,
      sandboxFormula: null,
      containerId1: null,
      newShareDriveStructure: null,
    }
  }

  toDomain(record: OrderedProjects, ...entity: any): ProjectEntity {
    return new ProjectEntity({
      id: record.id,
      createdAt: new Date(record.dateCreated),
      updatedAt: new Date(record.updatedAt),
      props: {
        projectPropertyType: record.projectPropertyType as ProjectPropertyType, // TODO: status any
        projectPropertyOwner: record.propertyOwnerName,
        projectNumber: record.projectNumber,
        systemSize: record.systemSize === null ? null : Number(record.systemSize),
        projectPropertyAddress: new Address({
          city: record.propertyAddressCity,
          country: record.propertyAddressCountry,
          postalCode: record.propertyAddressPostalCode,
          state: record.propertyAddressState,
          street1: record.propertyAddressStreet1,
          street2: record.propertyAddressStreet2,
          fullAddress: record.propertyFullAddress,
          coordinates: record.propertyAddressCoordinates.split(',').map((n) => Number(n)),
        }),
        // record.mailingAddressForWetStamps
        mailingFullAddressForWetStamp: record.mailingAddressForWetStamps,
        clientOrganizationId: record.clientOrganizationId,
        organizationName: record.organizationName,
        projectAssociatedRegulatory: new ProjectAssociatedRegulatoryBody({
          stateId: record.stateId,
          countyId: record.countyId,
          countySubdivisionsId: record.countyId,
          placeId: record.placeId,
        }),
        updatedBy: record.lastModifiedBy,
        totalOfJobs: record.totalOfJobs,
        // clientUserId: record.clientUserId,
        // clientUserName: record.clientUserName,
        numberOfWetStamp: null,
        mountingType: record.mountingType as MountingType, // TODO: status any
        hasHistoryElectricalPEStamp: !!record.hasHistoryElectricalPEStamp,
        hasHistoryStructuralPEStamp: !!record.hasHistoryStructuralPEStamp,
      },
    })
  }

  toResponse(entity: ProjectEntity, ...dtos: any): ProjectResponseDto {
    throw new Error('Method not implemented.')
  }
}
