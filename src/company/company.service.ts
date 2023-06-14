import { Inject, Injectable } from '@nestjs/common'
import { CompanyRepositoryPort } from './database/company.repository.port'
import { COMPANY_REPOSITORY } from './company.di-token'
import { CompanyProp } from './interfaces/company.interface'
import { UserRoleProp } from './interfaces/user-role.interface'

@Injectable()
export class CompanyService {
  constructor(@Inject(COMPANY_REPOSITORY) private readonly companyRepository: CompanyRepositoryPort) {}
  async createCompany(props: CompanyProp): Promise<CompanyProp> {
    return await this.companyRepository.insertCompany(props)
  }

  async findCompanyById(companyId: number): Promise<CompanyProp> {
    return await this.companyRepository.findOneById(companyId)
  }

  async giveUserRole(prop: UserRoleProp): Promise<UserRoleProp> {
    return await this.companyRepository.giveRole(prop)
  }
}
