import { Address } from '../../../modules/organization/domain/value-objects/address.vo'
import { ProjectAssociatedRegulatoryBody } from './value-objects/project-associated-regulatory-body.value-object'

export enum ProjectPropertyTypeEnum {
  Residential = 'Residential',
  Commercial = 'Commercial',
}

export enum MountingTypeEnum {
  Roof_Mount = 'Roof Mount',
  Ground_Mount = 'Ground Mount',
  RG_Mount = 'Roof Mount & Ground Mount',
}

export type ProjectPropertyType = 'Residential' | 'Commercial'
export type MountingType = 'Roof Mount' | 'Ground Mount' | 'Roof Mount & Ground Mount'

export interface CreateProjectProps {
  projectPropertyType: ProjectPropertyType
  projectPropertyOwner: string
  projectNumber: string | null
  projectPropertyAddress: Address
  coordinates: number[]
  clientOrganizationId: string
  projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
  updatedBy: string
}

export interface ProjectProps {
  projectPropertyType: ProjectPropertyType
  projectPropertyOwner: string
  projectNumber: string | null
  projectPropertyAddress: Address
  coordinates: number[]
  clientOrganizationId: string
  projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
  mountingType: MountingType
  updatedBy: string

  systemSize: number | null
  mailingAddressForWetStamp: string
  totalOfJobs: number
  numberOfWetStamp: number
}

export class ProjectUpdateProps {
  projectPropertyType: ProjectPropertyType
  projectPropertyOwner: string
  projectNumber: string | null
  projectPropertyAddress: Address
  projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
  updatedBy: string
  clientUserId: string
  clientUserName: string
}
