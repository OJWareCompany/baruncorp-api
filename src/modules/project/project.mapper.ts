import { Mapper } from '@src/libs/ddd/mapper.interface'
import { ProjectEntity } from './domain/project.entity'
import { Prisma, orderedProjects } from '@prisma/client'
import { ProjectResponseDto } from './dtos/project.response.dto'

/**
 * Entity, DB Record, Response DTO의 변환을 책임지는 클래스.
 * 변환을 한 곳에 묶어 관리하기 용이하다.
 */

export class ProjectMapper implements Mapper<ProjectEntity, orderedProjects, ProjectResponseDto> {
  toPersistence(entity: ProjectEntity): orderedProjects {
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
      mailingAddressForWetStamps: props.mailingAddressForWetStamp.fullAddress,
      projectPropertyType: props.projectPropertyType,
      isGroundMount: props.isGroundMount,
      systemSize: props.systemSize ? new Prisma.Decimal(props.systemSize) : null,
      updatedAt: new Date(),
      dateCreated: new Date(),

      clientId: props.clientOrganizationId,
      lastModifiedBy: props.updatedBy,

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

  toDomain(record: any, ...entity: any): ProjectEntity {
    throw new Error('Method not implemented.')
  }

  toResponse(entity: ProjectEntity, ...dtos: any): ProjectResponseDto {
    throw new Error('Method not implemented.')
  }
}
