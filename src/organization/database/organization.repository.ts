import { Injectable } from '@nestjs/common'
import { OrganizationRepositoryPort } from './organization.repository.port'
import { PrismaService } from '../../database/prisma.service'
import { Organizations, UserRole } from '@prisma/client'
import { UserRoleMapper } from '../../users/user-role.mapper'
import { OrganizationEntity } from '../entites/organization.entity'
import { OrganizationMapper } from '../organization.mapper'

// Where should I put member list? Event Storming Helpful Decide

export type UserRoleModel = UserRole
export type OrganizationModel = Organizations

@Injectable()
export class OrganizationRepository implements OrganizationRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userRoleMapper: UserRoleMapper,
    private readonly organizationMapper: OrganizationMapper,
  ) {}
  async findAll(): Promise<OrganizationEntity[]> {
    const records = await this.prismaService.organizations.findMany()
    return records.map(this.organizationMapper.toDomain)
  }

  async findOneById(organizationId: string): Promise<OrganizationEntity> {
    const record = await this.prismaService.organizations.findUnique({ where: { id: organizationId } })
    return this.organizationMapper.toDomain(record)
  }

  async findByName(name: string): Promise<OrganizationEntity[]> {
    const records = await this.prismaService.organizations.findMany({ where: { name: { contains: name } } })
    return records.map(this.organizationMapper.toDomain)
  }

  async findOneByName(name: string): Promise<OrganizationEntity> {
    const record = await this.prismaService.organizations.findFirst({ where: { name: { contains: name } } })
    return record && this.organizationMapper.toDomain(record)
  }

  // async isExisteByName(name: string): Promise<CompanyProp[]> {
  //   // return await this.prismaService.companies
  // }

  async insertOrganization(entity: OrganizationEntity): Promise<void> {
    const record = this.organizationMapper.toPersistence(entity)
    await this.prismaService.organizations.create({ data: record })
  }
}