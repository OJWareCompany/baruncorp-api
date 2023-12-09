import { AssignedTasks, OrderedJobs, OrderedProjects, OrderedServices, Service, Tasks, Users } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JobRepositoryPort } from './job.repository.port'
import { JobMapper } from '../job.mapper'
import { JobEntity } from '../domain/job.entity'
import { PrismaService } from '../../../modules/database/prisma.service'
import { JobNotFoundException } from '../domain/job.error'
import { zonedTimeToUtc } from 'date-fns-tz'
import { endOfMonth, startOfMonth } from 'date-fns'
import { JobStatusEnum } from '../domain/job.type'
import { OrderedServiceStatusEnum } from '../../ordered-service/domain/ordered-service.type'
type JobModel =
  | OrderedJobs & {
      orderedServices: (OrderedServices & {
        service: Service
        assignedTasks: (AssignedTasks & { task: Tasks; user: Users | null })[]
      })[]
    }
@Injectable()
export class JobRepository implements JobRepositoryPort {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jobMapper: JobMapper,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async insert(entity: JobEntity | JobEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.jobMapper.toPersistence)
    await this.prismaService.orderedJobs.createMany({ data: records })
    for (const entity of entities) {
      await entity.publishEvents(this.eventEmitter)
    }
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
    const record: JobModel | null = await this.prismaService.orderedJobs.findUnique({
      where: { id },
      include: {
        orderedServices: {
          include: {
            service: true,
            assignedTasks: {
              include: {
                task: true,
                user: true,
              },
            },
          },
        },
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
    const records: JobModel[] = await this.prismaService.orderedJobs.findMany({
      where: { projectId: projectId },
      include: {
        orderedServices: {
          include: {
            service: true,
            assignedTasks: {
              include: {
                task: true,
                user: true,
              },
            },
          },
        },
      },
    })

    return records.map(this.jobMapper.toDomain)
  }

  async findJobsToInvoice(clientOrganizationId: string, serviceMonth: Date): Promise<JobEntity[]> {
    const records = await this.prismaService.orderedJobs.findMany({
      where: {
        clientOrganizationId: clientOrganizationId,
        createdAt: {
          gte: zonedTimeToUtc(startOfMonth(serviceMonth), 'Etc/UTC'),
          lte: zonedTimeToUtc(endOfMonth(serviceMonth), 'Etc/UTC'), // serviceMonth가 UTC이니까 UTC를 UTC로 바꾸면 그대로.
        },
        jobStatus: { in: [JobStatusEnum.Completed, JobStatusEnum.Canceled] },
        orderedServices: { some: { status: OrderedServiceStatusEnum.Completed } },
        invoice: null,
      },
      include: {
        orderedServices: {
          include: {
            service: true,
            assignedTasks: {
              include: {
                task: true,
                user: true,
              },
            },
          },
        },
      },
    })
    return records.map(this.jobMapper.toDomain)
  }
}
