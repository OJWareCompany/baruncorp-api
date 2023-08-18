import { Address } from './value-objects/address.vo'

export interface OrganizationProps {
  name: string
  description: string
  email: string
  phoneNumber: string
  organizationType: string
  address: Address
  isActiveContractor: boolean | null
  isActiveWorkResource: boolean | null
  isRevenueShare: boolean | null
  isRevisionRevenueShare: boolean | null
  invoiceRecipient: string | null
  invoiceRecipientEmail: string | null
}

export interface CreateOrganizationProps {
  name: string
  description: string
  email: string
  phoneNumber: string
  organizationType: string
  address: Address
  isActiveContractor: boolean | null
  isActiveWorkResource: boolean | null
  isRevenueShare: boolean | null
  isRevisionRevenueShare: boolean | null
  invoiceRecipient: string | null
  invoiceRecipientEmail: string | null
}