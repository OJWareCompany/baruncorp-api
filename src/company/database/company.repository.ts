import { Injectable } from '@nestjs/common'
import { CompanyMember, CompanyRepositoryPort } from './company.repository.port'
import { CompanyProp } from '../interfaces/company.interface'
import { PrismaService } from '../../database/prisma.service'
import { UserRoleProp } from '../interfaces/user-role.interface'

// Where should I put member list? Event Storming Helpful Decide

@Injectable()
export class CompanyRepository implements CompanyRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  async findMembers(): Promise<CompanyMember[]> {
    const joinUserRole = {
      userRole: {
        select: {
          role: true,
        },
      },
    }

    const joinUser = {
      users: {
        select: {
          lastName: true,
          firstName: true,
          email: true,
          // ...joinUserRole,
        },
      },
    }

    const companyMember = await this.prismaService.companies.findMany({
      select: {
        name: true,
        ...joinUser,
      },
    })

    console.log(companyMember)

    return companyMember
  }

  async findMembersByCompanyId(companyId: number): Promise<CompanyMember> {
    const joinUserRole = {
      userRole: {
        select: {
          role: true,
        },
      },
    }

    const joinUser = {
      users: {
        select: {
          lastName: true,
          firstName: true,
          email: true,
          // ...joinUserRole,
        },
      },
    }

    return await this.prismaService.companies.findFirst({
      where: { id: companyId },
      select: {
        name: true,
        ...joinUser,
      },
    })
  }

  async findAll(): Promise<CompanyProp[]> {
    return await this.prismaService.companies.findMany()
  }

  async findOneById(companyId: number): Promise<CompanyProp> {
    return await this.prismaService.companies.findUnique({ where: { id: companyId } })
  }
  async findByName(name: string): Promise<CompanyProp[]> {
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

  // TODO: how to soft delete
  // TODO: how to use only userId when i delete record
  async removeRole(userRoleProp: UserRoleProp): Promise<void> {
    await this.prismaService.userRole.delete({
      where: { userId_role_companyType: userRoleProp },
    })
  }
}
