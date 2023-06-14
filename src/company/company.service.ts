import { Inject, Injectable } from '@nestjs/common'
import { COMPANY_REPOSITORY } from './company.di-token'
import { CompanyMember, CompanyRepositoryPort } from './database/company.repository.port'
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

  async findAll(): Promise<CompanyProp[]> {
    return await this.companyRepository.findAll()
  }

  async findMembers(): Promise<CompanyMember[]> {
    return await this.companyRepository.findMembers()
  }

  async findMembersByCompanyId(companyId: number): Promise<CompanyMember> {
    return await this.companyRepository.findMembersByCompanyId(companyId)
  }
}
