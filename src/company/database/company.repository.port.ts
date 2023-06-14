import { UserProp } from 'src/users/interfaces/user.interface'
import { CompanyProp } from '../interfaces/company.interface'
import { UserRoleProp } from '../interfaces/user-role.interface'

// TODO: how to generate company type that include user and user role
// type a = { [Key in UserProp]?: string }
export type CompanyMember = { users: Partial<UserProp>[] } & Partial<CompanyProp>

export interface CompanyRepositoryPort {
  findOneById(companyId: number): Promise<CompanyProp>
  findByName(name: string): Promise<CompanyProp[]>
  findAll(): Promise<CompanyProp[]>
  insertCompany(props: Omit<CompanyProp, 'id'>): Promise<CompanyProp>
  giveRole(prop: UserRoleProp): Promise<UserRoleProp>
  getRoleByUserId(userId: string): Promise<UserRoleProp>
  removeRole(userRoleProp: UserRoleProp): Promise<void>
  findMembers(): Promise<CompanyMember[]>
  findMembersByCompanyId(companyId: number): Promise<CompanyMember>
}
