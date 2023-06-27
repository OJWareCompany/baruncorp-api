import { OrganizationProp } from '../interfaces/organization.interface'

export class OrganizationEntity implements OrganizationProp {
  id: number
  name: string
  description: string
  // TODO: gonna be VO
  organizationType: string
}
