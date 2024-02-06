import { Address } from '../../../modules/organization/domain/value-objects/address.vo'
import { ProjectAssociatedRegulatoryBody } from './value-objects/project-associated-regulatory-body.value-object'

export enum ProjectPropertyTypeEnum {
  Residential = 'Residential',
  Commercial = 'Commercial',
}

export enum MountingTypeEnum {
  Roof_Mount = 'Roof Mount',
  Ground_Mount = 'Ground Mount',
}

export type MountingType = 'Roof Mount' | 'Ground Mount'

export interface CreateProjectProps {
  projectPropertyType: ProjectPropertyTypeEnum
  projectPropertyOwner: string | null
  projectNumber: string | null
  projectPropertyAddress: Address
  clientOrganizationId: string
  organizationName: string
  projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
  updatedBy: string
}

export interface ProjectProps extends CreateProjectProps {
  mountingType: MountingType | null
  hasHistoryElectricalPEStamp: boolean
  hasHistoryStructuralPEStamp: boolean
  systemSize: number | null
  mailingFullAddressForWetStamp: string | null
  totalOfJobs: number
  numberOfWetStamp: number | null
}

export interface UpdateProjectProps {
  projectPropertyType: ProjectPropertyTypeEnum
  projectPropertyOwner: string | null
  projectNumber: string | null
  updatedBy: string
}

export interface UpdatePropertyAddressProps {
  projectPropertyAddress: Address
  projectAssociatedRegulatory: Omit<ProjectAssociatedRegulatoryBody, 'ahjId'>
}
