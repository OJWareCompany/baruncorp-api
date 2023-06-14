import { CompanyProp } from '../interfaces/company.interface'
import { UserRoleProp } from '../interfaces/user-role.interface'

export interface CompanyRepositoryPort {
  findOneById(companyId: number): Promise<CompanyProp>
  findOneByName(name: string): Promise<CompanyProp[]>
  insertCompany(props: Omit<CompanyProp, 'id'>): Promise<CompanyProp>
  giveRole(prop: UserRoleProp): Promise<UserRoleProp>
  getRoleByUserId(userId: string): Promise<UserRoleProp>
  removeRole(userRoleProp: UserRoleProp): Promise<void>
}
