import { ProjectRepositoryPort } from './project.repository.port'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { ProjectEntity } from '../domain/project.entity'
import { UserEntity } from '../../users/domain/user.entity'
import UserMapper from '../../users/user.mapper'
import { ProjectMapper } from '../project.mapper'

@Injectable()
export class ProjectRepository implements ProjectRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly projectMapper: ProjectMapper,
    private readonly userMapper: UserMapper, // TODO: 다른 컨텍스트간 Mapper 공유 가능?
  ) {}

  async findProject(id: string): Promise<ProjectEntity> {
    const record = await this.prismaService.orderedProjects.findUnique({ where: { id } })
    return this.projectMapper.toDomain(record)
  }

  async update(entity: ProjectEntity): Promise<void> {
    const record = this.projectMapper.toPersistence(entity)
    await this.prismaService.orderedProjects.update({
      where: { id: record.id },
      data: { ...record },
    })
  }

  async countTotalOfJobs(id: string): Promise<number> {
    return await this.prismaService.orderedJobs.count({ where: { projectId: id } })
  }

  async updateProjectWhenJobIsCreated(entity: ProjectEntity) {
    const record = this.projectMapper.toPersistence(entity)
    await this.prismaService.orderedProjects.update({
      where: { id: record.id },
      data: {
        totalOfJobs: record.totalOfJobs,
        systemSize: record.systemSize,
        mailingAddressForWetStamps: record.mailingAddressForWetStamps,
        mountingType: record.mountingType,
      },
    })
  }

  async updateProjectMailingAddress(entity: ProjectEntity): Promise<void> {
    const record = this.projectMapper.toPersistence(entity)
    await this.prismaService.orderedProjects.update({
      where: { id: record.id },
      data: { mailingAddressForWetStamps: record.mailingAddressForWetStamps },
    })
  }

  async updateProjectSystemSize(entity: ProjectEntity): Promise<void> {
    const record = this.projectMapper.toPersistence(entity)
    await this.prismaService.orderedProjects.update({
      where: { id: record.id },
      data: { systemSize: record.systemSize },
    })
  }

  async createProject(projectEntity: ProjectEntity): Promise<void> {
    const record = this.projectMapper.toPersistence(projectEntity)
    await this.prismaService.orderedProjects.create({ data: { ...record } })
  }

  async findClientUserById(id: string): Promise<UserEntity> {
    const user = await this.prismaService.users.findUnique({ where: { id } })
    return user && this.userMapper.toDomain(user)
  }

  async isExistedOrganizationById(organizationId: string): Promise<boolean> {
    return !!(await this.prismaService.organizations.findUnique({ where: { id: organizationId } }))
  }

  async isExistedProjectByClientIdAndProjectNumber(clientId: string, projectNumber: string): Promise<boolean> {
    return !!(await this.prismaService.orderedProjects.findFirst({
      where: {
        clientOrganizationId: clientId,
        projectNumber: projectNumber,
      },
    }))
  }

  async isExistedByPropertyOwnerAddress(propertyOwnerAddress: string): Promise<boolean> {
    return !!(await this.prismaService.orderedProjects.findFirst({ where: { propertyAddress: propertyOwnerAddress } }))
  }
}
