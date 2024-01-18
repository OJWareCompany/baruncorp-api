import { Injectable } from '@nestjs/common'
import { OrganizationRepositoryPort } from './organization.repository.port'
import { PrismaService } from '../../database/prisma.service'
import { Organizations, UserRole } from '@prisma/client'
import { UserRoleMapper } from '../../users/user-role.mapper'
import { OrganizationMapper } from '../organization.mapper'
import { OrganizationEntity } from '../domain/organization.entity'
import { OrganizationNotFoundException } from '../domain/organization.error'

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
  async update(entity: OrganizationEntity): Promise<void> {
    const record = this.organizationMapper.toPersistence(entity)
    await this.prismaService.organizations.update({ where: { id: record.id }, data: record })
  }

  async findAll(): Promise<OrganizationEntity[]> {
    const records = await this.prismaService.organizations.findMany()
    return records.map(this.organizationMapper.toDomain)
  }

  async findOneOrThrow(organizationId: string): Promise<OrganizationEntity> {
    const record = await this.prismaService.organizations.findUnique({ where: { id: organizationId } })
    if (!record) throw new OrganizationNotFoundException()
    return this.organizationMapper.toDomain(record)
  }

  async findOneByName(name: string): Promise<OrganizationEntity | null> {
    const record = await this.prismaService.organizations.findFirst({ where: { name: name } })
    if (!record) null
    return record && this.organizationMapper.toDomain(record)
  }

  async insertOrganization(entity: OrganizationEntity): Promise<void> {
    const record = this.organizationMapper.toPersistence(entity)
    await this.prismaService.organizations.create({ data: record })
  }
}
