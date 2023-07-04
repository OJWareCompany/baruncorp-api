import { OrganizationEntity } from '../entites/organization.entity'

// TODO: how to generate Organization type that include user and user role
// type a = { [Key in UserProp]?: string }
// export type OrganizationMember = { users: Partial<UserProps>[] } & Partial<OrganizationProp>

export interface OrganizationRepositoryPort {
  findOneById(organizationId: string): Promise<OrganizationEntity>
  findByName(name: string): Promise<OrganizationEntity[]>
  findOneByName(name: string): Promise<OrganizationEntity>
  findAll(): Promise<OrganizationEntity[]>
  insertOrganization(props: OrganizationEntity): Promise<void>
}
