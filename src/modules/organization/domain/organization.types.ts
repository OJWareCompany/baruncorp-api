import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import { Address } from './value-objects/address.vo'
export interface CreateOrganizationProps {
  name: string
  phoneNumber: string | null
  address: Address
  isActiveContractor: boolean | null
  isActiveWorkResource: boolean | null
  isRevenueShare: boolean | null
  isRevisionRevenueShare: boolean | null
  invoiceRecipient: string | null
  invoiceRecipientEmail: string | null
  projectPropertyTypeDefaultValue: ProjectPropertyTypeEnum | null
  mountingTypeDefaultValue: MountingTypeEnum | null
  isSpecialRevisionPricing: boolean
  numberOfFreeRevisionCount: number | null
  isVendor: boolean
}
export interface OrganizationProps extends CreateOrganizationProps {
  organizationType: string
  isDelinquent: boolean
}
