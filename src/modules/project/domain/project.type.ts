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
  totalOfJobs: number
  numberOfWetStamp: number
  clientUserId: string
  clientUserName: string
}

export interface CreateProjectProps {
  projectPropertyType: ProjectPropertyType
  projectPropertyOwner: string
  projectNumber: string | null
  projectPropertyAddress: Address
  clientOrganizationId: string
  projectAssociatedRegulatory: ProjectAssociatedRegulatoryBody
  updatedBy: string
  totalOfJobs: number
  // numberOfWetStamp: number
  // clientUserId: string
  // clientUserName: string
  // systemSize: number | null
  // isGroundMount: boolean
  // mailingAddressForWetStamp: Address
}

// mailingAddressForWetStamp: new Address({
//   ...command.mailingAddressForWetStamp,
// }),
// systemSize: command.systemSize,
// isGroundMount: command.isGroundMount,
// numberOfWetStamp: command.numberOfWetStamp,
// clientUserId: null,
// clientUserName: null,
