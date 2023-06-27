import { UserProp } from '../../users/interfaces/user.interface'
import { OrganizationProp } from '../interfaces/organization.interface'
import { UserRoleProp } from '../interfaces/user-role.interface'

// TODO: how to generate Organization type that include user and user role
// type a = { [Key in UserProp]?: string }
export type OrganizationMember = { users: Partial<UserProp>[] } & Partial<OrganizationProp>

export interface OrganizationRepositoryPort {
  findOneById(organizationId: number): Promise<OrganizationProp>
  findByName(name: string): Promise<OrganizationProp[]>
  findAll(): Promise<OrganizationProp[]>
  insertOrganization(props: Omit<OrganizationProp, 'id'>): Promise<OrganizationProp>
  giveRole(prop: UserRoleProp): Promise<UserRoleProp>
  getRoleByUserId(userId: string): Promise<UserRoleProp>
  removeRole(userRoleProp: UserRoleProp): Promise<void>
  findMembers(): Promise<OrganizationMember[]>
  findMembersByOrganizationId(organizationId: number): Promise<OrganizationMember>
}
