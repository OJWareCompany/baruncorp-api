import { Address } from '../../../modules/organization/domain/value-objects/address.vo'
import { ProjectAssociatedRegulatoryBody } from './value-objects/project-associated-regulatory-body.value-object'

export type ProjectPropertyType = 'Residential' | 'Commercial'

export interface ProjectProps {
  projectPropertyType: ProjectPropertyType
  projectPropertyOwner: string
  projectNumber: string | null
  systemSize: number | null
  isGroundMount: boolean
  projectPropertyAddress: Address
  mailingAddressForWetStamp: Address
  clientOrganizationId: string
  projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
  updatedBy: string
}

export interface CreateProjectProps {
  projectPropertyType: ProjectPropertyType
  projectPropertyOwner: string
  projectNumber: string | null
  systemSize: number | null
  isGroundMount: boolean
  projectPropertyAddress: Address
  mailingAddressForWetStamp: Address
  clientOrganizationId: string
  projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
  updatedBy: string
}
