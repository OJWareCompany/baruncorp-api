import { Address } from './value-objects/address.vo'

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
