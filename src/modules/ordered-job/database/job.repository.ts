import { OrderedProjects, OrderedTasks, Users } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JobRepositoryPort } from './job.repository.port'
import { JobMapper } from '../job.mapper'
import { JobEntity } from '../domain/job.entity'
import { PrismaService } from '../../../modules/database/prisma.service'

@Injectable()
export class JobRepository implements JobRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jobMapper: JobMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async insert(entity: JobEntity): Promise<void> {
    const record = this.jobMapper.toPersistence(entity)
    await this.prismaService.orderedJobs.create({ data: { ...record } })
    await entity.publishEvents(this.eventEmitter)
  }

  async update(entity: JobEntity): Promise<void> {
    const record = this.jobMapper.toPersistence(entity)
    await this.prismaService.orderedJobs.update({ where: { id: record.id }, data: { ...record } })
    await entity.publishEvents(this.eventEmitter)
  }

  async findUser(id: string): Promise<Users> {
    return await this.prismaService.users.findUnique({ where: { id } })
  }

  async findProject(id: string): Promise<OrderedProjects> {
    return await this.prismaService.orderedProjects.findUnique({ where: { id } })
  }

  async findJob(id: string): Promise<JobEntity> {
    const record = await this.prismaService.orderedJobs.findUnique({
      where: { id },
      include: {
        orderedTasks: true,
      },
    })
    record.orderedTasks
    const currentJob = await this.prismaService.orderedJobs.findFirst({
      where: { projectId: record.projectId },
      orderBy: { createdAt: 'desc' },
    })
    return this.jobMapper.toDomain({
      ...record,
      isCurrentJob: record.id === currentJob.id,
    })
  }
}
