import { Injectable } from '@nestjs/common'
import { CompanyRepositoryPort } from './company.repository.port'
import { CompanyProp } from '../interfaces/company.interface'
import { PrismaService } from 'src/database/prisma.service'
import { UserRoleProp } from '../interfaces/user-role.interface'

@Injectable()
export class CompanyRepository implements CompanyRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneById(companyId: number): Promise<CompanyProp> {
    return await this.prismaService.companies.findUnique({ where: { id: companyId } })
  }
  async findOneByName(name: string): Promise<CompanyProp[]> {
    return await this.prismaService.companies.findMany({ where: { name: { contains: name } } })
  }

  async insertCompany(props: Omit<CompanyProp, 'id'>): Promise<CompanyProp> {
    return await this.prismaService.companies.create({ data: props })
  }

  async getRoleByUserId(userId: string): Promise<UserRoleProp> {
    return await this.prismaService.userRole.findFirst({ where: { userId } })
  }

  async giveRole(prop: UserRoleProp): Promise<UserRoleProp> {
    return await this.prismaService.userRole.create({ data: prop })
  }

  // TODO: how to use only userId when i delete record
  async removeRole(userRoleProp: UserRoleProp): Promise<void> {
    await this.prismaService.userRole.delete({
      where: { userId_role_companyType: userRoleProp },
    })
  }
}
