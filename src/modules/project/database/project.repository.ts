import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { ProjectEntity } from '../domain/project.entity'
import { UserEntity } from '../../users/domain/user.entity'
import { ProjectMapper } from '../project.mapper'
import { ProjectNotFoundException } from '../domain/project.error'
import { ProjectRepositoryPort } from './project.repository.port'
import { Prisma } from '@prisma/client'

@Injectable()
export class ProjectRepository implements ProjectRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly projectMapper: ProjectMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}
  findClientUserById(id: string): Promise<UserEntity> {
    throw new Error('Method not implemented.')
  }

  async findOne(whereInput: Prisma.OrderedProjectsWhereInput): Promise<ProjectEntity | null> {
    const record = await this.prismaService.orderedProjects.findFirst({ where: whereInput })
    if (!record) return record
    return this.projectMapper.toDomain(record)
  }

  async findOneOrThrow(whereInput: Prisma.OrderedProjectsWhereInput): Promise<ProjectEntity> {
    const record = await this.findOne(whereInput)
    if (!record) throw new ProjectNotFoundException()
    return record
  }

  async update(entity: ProjectEntity): Promise<void> {
    const record = this.projectMapper.toPersistence(entity)
    await this.prismaService.orderedProjects.update({
      where: { id: record.id },
      data: { ...record },
    })
    await entity.publishEvents(this.eventEmitter)
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

  async isExistedByPropertyOwnerAddress(clientOrganizationId: string, propertyOwnerAddress: string): Promise<boolean> {
    return !!(await this.prismaService.orderedProjects.findFirst({
      where: {
        clientOrganizationId: clientOrganizationId,
        propertyFullAddress: propertyOwnerAddress,
      },
    }))
  }
}
