import { ProjectPropertyType, MountingType } from '../../project/domain/project.type'
import { Address } from './value-objects/address.vo'

export interface OrganizationProps {
  name: string
  description: string | null
  email: string | null
  phoneNumber: string | null
  organizationType: string
  address: Address
  isActiveContractor: boolean | null
  isActiveWorkResource: boolean | null
  isRevenueShare: boolean | null
  isRevisionRevenueShare: boolean | null
  invoiceRecipient: string | null
  invoiceRecipientEmail: string | null
  projectPropertyTypeDefaultValue: ProjectPropertyType | null
  mountingTypeDefaultValue: MountingType | null
}

export interface CreateOrganizationProps {
  name: string
  description: string | null
  email: string | null
  phoneNumber: string | null
  organizationType: string
  address: Address
  isActiveContractor: boolean | null
  isActiveWorkResource: boolean | null
  isRevenueShare: boolean | null
  isRevisionRevenueShare: boolean | null
  invoiceRecipient: string | null
  invoiceRecipientEmail: string | null
  projectPropertyTypeDefaultValue: ProjectPropertyType | null
  mountingTypeDefaultValue: MountingType | null
}
