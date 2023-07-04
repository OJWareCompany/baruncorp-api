import { Injectable } from '@nestjs/common'
import { OrganizationRepositoryPort } from './organization.repository.port'
import { OrganizationProp } from '../interfaces/organization.interface'
import { PrismaService } from '../../database/prisma.service'
import { UserRole } from '@prisma/client'
import { UserRoleMapper } from '../../users/user-role.mapper'

// Where should I put member list? Event Storming Helpful Decide

export type UserRoleModel = UserRole

@Injectable()
export class OrganizationRepository implements OrganizationRepositoryPort {
  constructor(private readonly prismaService: PrismaService, private readonly userRoleMapper: UserRoleMapper) {}
  async findAll(): Promise<OrganizationProp[]> {
    return await this.prismaService.organizations.findMany()
  }

  async findOneById(organizationId: string): Promise<OrganizationProp> {
    return await this.prismaService.organizations.findUnique({ where: { id: organizationId } })
  }

  async findByName(name: string): Promise<OrganizationProp[]> {
    return await this.prismaService.organizations.findMany({ where: { name: { contains: name } } })
  }

  async findOneByName(name: string): Promise<OrganizationProp> {
    return await this.prismaService.organizations.findFirst({ where: { name: { contains: name } } })
  }

  // async isExisteByName(name: string): Promise<CompanyProp[]> {
  //   // return await this.prismaService.companies
  // }

  async insertOrganization(props: Omit<OrganizationProp, 'id'>): Promise<OrganizationProp> {
    return await this.prismaService.organizations.create({ data: props })
  }
}
