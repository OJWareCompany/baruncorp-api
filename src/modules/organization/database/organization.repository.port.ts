// TODO: how to generate Organization type that include user and user role
// type a = { [Key in UserProp]?: string }
// export type OrganizationMember = { users: Partial<UserProps>[] } & Partial<OrganizationProp>

import { OrganizationEntity } from '../domain/organization.entity'

export interface OrganizationRepositoryPort {
  findOneOrThrow(organizationId: string): Promise<OrganizationEntity>
  findOneByName(name: string): Promise<OrganizationEntity | null>
  findAll(): Promise<OrganizationEntity[]>
  insertOrganization(props: OrganizationEntity): Promise<void>
  update(entity: OrganizationEntity): Promise<void>
}
