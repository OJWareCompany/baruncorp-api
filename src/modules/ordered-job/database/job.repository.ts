import { AssignedTasks, OrderedJobs, OrderedServices, Prisma, Service, Tasks, Users } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JobRepositoryPort } from './job.repository.port'
import { JobMapper } from '../job.mapper'
import { JobEntity } from '../domain/job.entity'
import { PrismaService } from '../../../modules/database/prisma.service'
import { JobNotFoundException } from '../domain/job.error'
import { zonedTimeToUtc } from 'date-fns-tz'
import { endOfMonth, startOfMonth } from 'date-fns'
import { AutoOnlyJobStatusEnum, JobStatusEnum } from '../domain/job.type'
import { OrderedServiceStatusEnum } from '../../ordered-service/domain/ordered-service.type'
import { UserEntity } from '../../users/domain/user.entity'
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

  async updateOnlyEditorInfo(entity: JobEntity, editor?: UserEntity): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.jobMapper.toPersistence)
    await Promise.all(
      records.map(async (record) => {
        await this.prismaService.orderedJobs.update({
          where: { id: record.id },
          data: {
            updatedBy: editor?.userName.fullName || 'System',
          },
        })
      }),
    )
  }

  /**
   * order modification history 생성하는 서비스에서, 실질적으로 변경된 데이터가 없을시 updated At을 롤백한다.
   */
  async rollbackUpdatedAtAndEditor(entity: JobEntity): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    const records = entities.map(this.jobMapper.toPersistence)
    await Promise.all(
      records.map(async (record) => {
        await this.prismaService.orderedJobs.update({
          where: { id: record.id },
          data: {
            updatedAt: record.updatedAt,
            updatedBy: entity.getProps().updatedBy,
          },
        })
      }),
    )
  }

  async getTotalInvoiceAmount(jobId: string): Promise<number> {
    const total = await this.prismaService.orderedServices.aggregate({
      _sum: { price: true },
      where: {
        jobId: jobId,
        status: {
          in: [
            OrderedServiceStatusEnum.Completed,
            OrderedServiceStatusEnum.Canceled_Invoice, //
          ],
        },
      },
    })
    return Number(total._sum)
  }

  async getSubtotalInvoiceAmount(jobId: string): Promise<number> {
    const total = await this.prismaService.orderedServices.aggregate({
      _sum: { price: true },
      where: {
        jobId: jobId,
        status: {
          in: [
            OrderedServiceStatusEnum.Completed,
            OrderedServiceStatusEnum.Canceled_Invoice, //
          ],
        },
      },
    })
    return Number(total._sum)
  }

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
          data: { ...record, updatedAt: new Date() }, // 매개변수의 entity의 updatedAt은 수정되지 않는다. update후에 이 entity를 반환해야하나.
        })
      }),
    )

    for (const entity of entities) {
      entity.addUpdateEvent()
      await entity.publishEvents(this.eventEmitter)
    }
  }

  async findJobOrThrow(id: string): Promise<JobEntity> {
    const prerequisiteTasks = await this.prismaService.prerequisiteTasks.findMany()
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
      prerequisiteTasks: prerequisiteTasks,
    })
  }

  async findManyBy(whereInput: Prisma.OrderedJobsWhereInput): Promise<JobEntity[]> {
    const prerequisiteTasks = await this.prismaService.prerequisiteTasks.findMany()
    const records: JobModel[] = await this.prismaService.orderedJobs.findMany({
      where: whereInput,
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

    return records.map((rec) => this.jobMapper.toDomain({ ...rec, prerequisiteTasks }))
  }

  async findJobsToInvoice(clientOrganizationId: string, serviceMonth: Date): Promise<JobEntity[]> {
    const prerequisiteTasks = await this.prismaService.prerequisiteTasks.findMany()
    const records = await this.prismaService.orderedJobs.findMany({
      where: {
        clientOrganizationId: clientOrganizationId,
        createdAt: {
          gte: zonedTimeToUtc(startOfMonth(serviceMonth), 'Etc/UTC'),
          lte: zonedTimeToUtc(endOfMonth(serviceMonth), 'Etc/UTC'), // serviceMonth가 UTC이니까 UTC를 UTC로 바꾸면 그대로.
        },
        jobStatus: {
          in: [
            AutoOnlyJobStatusEnum.Sent_To_Client,
            JobStatusEnum.Completed,
            JobStatusEnum.Canceled,
            JobStatusEnum.Canceled_Invoice,
          ],
        },
        orderedServices: {
          some: {
            status: {
              in: [
                OrderedServiceStatusEnum.Completed,
                OrderedServiceStatusEnum.Canceled_Invoice, //
              ],
            },
          },
        },
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
    return records.map((rec) => this.jobMapper.toDomain({ ...rec, prerequisiteTasks }))
  }
}
