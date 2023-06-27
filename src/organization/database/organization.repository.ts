import { Injectable } from '@nestjs/common'
import { OrganizationMember, OrganizationRepositoryPort } from './organization.repository.port'
import { OrganizationProp } from '../interfaces/organization.interface'
import { PrismaService } from '../../database/prisma.service'
import { UserRoleProp } from '../interfaces/user-role.interface'

// Where should I put member list? Event Storming Helpful Decide

@Injectable()
export class OrganizationRepository implements OrganizationRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  async findMembers(): Promise<OrganizationMember[]> {
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

    const organizationMember = await this.prismaService.organizations.findMany({
      select: {
        name: true,
        ...joinUser,
      },
    })

    console.log(organizationMember)

    return organizationMember
  }

  async findMembersByOrganizationId(organizationId: number): Promise<OrganizationMember> {
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

    return await this.prismaService.organizations.findFirst({
      where: { id: organizationId },
      select: {
        name: true,
        ...joinUser,
      },
    })
  }

  async findAll(): Promise<OrganizationProp[]> {
    return await this.prismaService.organizations.findMany()
  }

  async findOneById(organizationId: number): Promise<OrganizationProp> {
    return await this.prismaService.organizations.findUnique({ where: { id: organizationId } })
  }

  async findByName(name: string): Promise<OrganizationProp[]> {
    return await this.prismaService.organizations.findMany({ where: { name: { contains: name } } })
  }

  // async isExisteByName(name: string): Promise<CompanyProp[]> {
  //   // return await this.prismaService.companies
  // }

  async insertOrganization(props: Omit<OrganizationProp, 'id'>): Promise<OrganizationProp> {
    return await this.prismaService.organizations.create({ data: props })
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
      where: { userId_role_organizationType: userRoleProp },
    })
  }
}
