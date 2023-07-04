import { Address } from '../vo/address.vo'

export interface OrganizationProps {
  name: string
  description: string
  email: string
  phoneNumber: string
  organizationType: string
  address: Address
}

export interface CreateOrganizationProps {
  name: string
  description: string
  email: string
  phoneNumber: string
  organizationType: string
  address: Address
}
