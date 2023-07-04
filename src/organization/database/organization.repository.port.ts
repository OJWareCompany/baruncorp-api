import { OrganizationProp } from '../interfaces/organization.interface'

// TODO: how to generate Organization type that include user and user role
// type a = { [Key in UserProp]?: string }
// export type OrganizationMember = { users: Partial<UserProps>[] } & Partial<OrganizationProp>

export interface OrganizationRepositoryPort {
  findOneById(organizationId: string): Promise<OrganizationProp>
  findByName(name: string): Promise<OrganizationProp[]>
  findOneByName(name: string): Promise<OrganizationProp>
  findAll(): Promise<OrganizationProp[]>
  insertOrganization(props: Omit<OrganizationProp, 'id'>): Promise<OrganizationProp>
}
