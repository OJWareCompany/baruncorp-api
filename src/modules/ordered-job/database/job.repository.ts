import { OrderedProjects, OrderedTasks, Users } from '@prisma/client'
import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JobRepositoryPort } from './job.repository.port'
import { JobMapper } from '../job.mapper'
import { JobEntity } from '../domain/job.entity'
import { PrismaService } from '../../../modules/database/prisma.service'
import { JobNotFoundException } from '../domain/job.error'

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

  async update(entity: JobEntity | JobEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.jobMapper.toPersistence)
    await Promise.all(
      records.map(async (record) => {
        await this.prismaService.orderedJobs.update({
          where: { id: record.id },
          data: record,
        })
      }),
    )

    for (const entity of entities) {
      entity.addUpdateEvent()
      await entity.publishEvents(this.eventEmitter)
    }
  }

  async findUser(id: string): Promise<Users | null> {
    return await this.prismaService.users.findUnique({ where: { id } })
  }

  async findProject(id: string): Promise<OrderedProjects | null> {
    return await this.prismaService.orderedProjects.findUnique({ where: { id } })
  }

  async findJobOrThrow(id: string): Promise<JobEntity> {
    const record = await this.prismaService.orderedJobs.findUnique({
      where: { id },
      include: {
        orderedTasks: true,
      },
    })
    if (!record) throw new JobNotFoundException()

    const currentJob = await this.prismaService.orderedJobs.findFirst({
      where: { projectId: record.projectId },
      orderBy: { createdAt: 'desc' },
    })
    return this.jobMapper.toDomain({
      ...record,
      isCurrentJob: record.id === currentJob?.id,
    })
  }

  async findManyJob(projectId: string): Promise<JobEntity[]> {
    const records = await this.prismaService.orderedJobs.findMany({
      where: { projectId },
      include: {
        orderedTasks: true,
      },
    })

    return records.map(this.jobMapper.toDomain)
  }
}
