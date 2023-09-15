// TODO: how to generate Organization type that include user and user role
// type a = { [Key in UserProp]?: string }
// export type OrganizationMember = { users: Partial<UserProps>[] } & Partial<OrganizationProp>

import { OrganizationEntity } from '../domain/organization.entity'

export interface OrganizationRepositoryPort {
  findOneById(organizationId: string): Promise<OrganizationEntity | null>
  findByName(name: string): Promise<OrganizationEntity[]>
  findOneByName(name: string): Promise<OrganizationEntity | null>
  findAll(): Promise<OrganizationEntity[]>
  insertOrganization(props: OrganizationEntity): Promise<void>
}
