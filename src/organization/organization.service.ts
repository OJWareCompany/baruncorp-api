import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { ORGANIZATION_REPOSITORY } from './organization.di-token'
import { OrganizationMember, OrganizationRepositoryPort } from './database/organization.repository.port'
import { OrganizationProp } from './interfaces/organization.interface'
import { UserRoleProp } from './interfaces/user-role.interface'

@Injectable()
export class OrganizationService {
  constructor(@Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepository: OrganizationRepositoryPort) {}

  async createOrganization(props: Omit<OrganizationProp, 'id'>): Promise<OrganizationProp> {
    const organization = await this.organizationRepository.findByName(props.name)
    if (organization) throw new ConflictException(`${props.name} is aleady existed.`, '20001')
    return await this.organizationRepository.insertOrganization(props)
  }

  async findOrganizationById(organizationId: number): Promise<OrganizationProp> {
    return await this.organizationRepository.findOneById(organizationId)
  }

  async giveUserRole(prop: UserRoleProp): Promise<UserRoleProp> {
    return await this.organizationRepository.giveRole(prop)
  }

  async findAll(): Promise<OrganizationProp[]> {
    return await this.organizationRepository.findAll()
  }

  async findMembers(): Promise<OrganizationMember[]> {
    return await this.organizationRepository.findMembers()
  }

  async findMembersByOrganizationId(organizationId: number): Promise<OrganizationMember> {
    return await this.organizationRepository.findMembersByOrganizationId(organizationId)
  }
}
