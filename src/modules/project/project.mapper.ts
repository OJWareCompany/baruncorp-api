import { Mapper } from '../../libs/ddd/mapper.interface'
import { ProjectEntity } from './domain/project.entity'
import { Prisma, OrderedProjects } from '@prisma/client'
import { ProjectResponseDto } from './dtos/project.response.dto'
import { Address } from '../organization/domain/value-objects/address.vo'
import { ProjectAssociatedRegulatoryBody } from './domain/value-objects/project-associated-regulatory-body.value-object'

/**
 * Entity, DB Record, Response DTO의 변환을 책임지는 클래스.
 * 변환을 한 곳에 묶어 관리하기 용이하다.
 */

export class ProjectMapper implements Mapper<ProjectEntity, OrderedProjects, ProjectResponseDto> {
  toPersistence(entity: ProjectEntity): OrderedProjects {
    const props = entity.getProps()

    return {
      id: entity.id,
      projectNumber: props.projectNumber,
      propertyAddress: props.projectPropertyAddress.fullAddress,
      propertyAddressStreet1: props.projectPropertyAddress.street1,
      propertyAddressStreet2: props.projectPropertyAddress.street2,
      propertyAddressCity: props.projectPropertyAddress.city,
      propertyAddressState: props.projectPropertyAddress.state,
      propertyAddressPostalCode: props.projectPropertyAddress.postalCode,
      propertyOwnerName: props.projectPropertyOwner,
      mailingAddressForWetStamps: props.mailingAddressForWetStamp,
      projectPropertyType: props.projectPropertyType,
      isGroundMount: props.isGroundMount,
      systemSize: props.systemSize ? new Prisma.Decimal(props.systemSize) : null,
      updatedAt: new Date(),
      dateCreated: new Date(),

      designOrPeStampPreviouslyDoneOnProjectOutside: 0, // TODO
      totalOfJobs: 1, // TODO

      clientId: props.clientOrganizationId,
      lastModifiedBy: props.updatedBy,

      clientUserId: props.clientOrganizationId,
      clientUserName: props.clientUserName,

      stateId: props.projectAssociatedRegulatory.stateId,
      countyId: props.projectAssociatedRegulatory.countyId,
      countySubdivisionsId: props.projectAssociatedRegulatory.countySubdivisionsId,
      placeId: props.projectAssociatedRegulatory.placeId,
      ahjId: props.projectAssociatedRegulatory.ahjId,

      ahjAutomationLastRunDate: null,

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
        projectPropertyType: record.projectPropertyType === 'Residential' ? 'Residential' : 'Commercial',
        projectPropertyOwner: record.propertyOwnerName,
        projectNumber: record.projectNumber,
        systemSize: Number(record.systemSize),
        isGroundMount: record.isGroundMount,
        projectPropertyAddress: new Address({
          city: record.propertyAddressCity,
          country: null,
          postalCode: record.propertyAddressPostalCode,
          state: record.propertyAddressState,
          street1: record.propertyAddressStreet1,
          street2: record.propertyAddressStreet2,
          fullAddress: record.propertyAddress,
        }),
        mailingAddressForWetStamp: record.mailingAddressForWetStamps,
        clientOrganizationId: record.clientId,
        projectAssociatedRegulatory: new ProjectAssociatedRegulatoryBody({
          stateId: record.stateId,
          countyId: record.countyId,
          countySubdivisionsId: record.countyId,
          placeId: record.placeId,
        }),
        updatedBy: record.lastModifiedBy,
        totalOfJobs: record.totalOfJobs,
        clientUserId: record.clientUserId,
        clientUserName: record.clientUserName,
        numberOfWetStamp: null,
      },
    })
  }

  toResponse(entity: ProjectEntity, ...dtos: any): ProjectResponseDto {
    throw new Error('Method not implemented.')
  }
}
