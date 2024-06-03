import { AssignedTasks, OrderedJobs, OrderedServices, Prisma, Service, Tasks, Users } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JobRepositoryPort } from './job.repository.port'
import { JobMapper } from '../job.mapper'
import { JobEntity } from '../domain/job.entity'
import { PrismaService } from '../../../modules/database/prisma.service'
import { JobNotFoundException } from '../domain/job.error'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { addMonths, endOfMonth, startOfMonth } from 'date-fns'
import { AutoOnlyJobStatusEnum, JobStatusEnum } from '../domain/job.type'
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

  async delete(entity: JobEntity | JobEntity[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity]
    // 하위 엔티티를 먼저 제거해야 제거가 된다.
    for (const entity of entities) {
      entity.addUpdateEvent()
      await entity.publishEvents(this.eventEmitter)
    }
    const records = entities.map(this.jobMapper.toPersistence)
    await this.prismaService.orderedJobs.deleteMany({ where: { id: { in: records.map((record) => record.id) } } })
  }

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

  /**
   * 1. 모든 국가에서 EST 기준으로 인보이스 날짜를 선택한다.
   * 2. UTC로 변환해서 서버에 전달한다.
   *
   * 시스템에서는 하나의 기준 시간이 필요하다. 클라이언트의 요구사항대로 EST가 기준시간이 된다.
   * - 인보이스, 등 모든 업무는 EST가 기준
   * - 하나의 달력을 모든 국가에서 동일하게 쓰려면 기준이 되는 시간이 있어야한다.
   * - 선택하여 입력되는 날짜 데이터는 무조건 EST 하나로 통일되어야한다.
   *
   * 왜?
   * 인보이스를 만들 때
   * KST로 4월 1일을 선택 입력한다면(4월 1일 00:00:00) UTC로 변환시 3월 말일이 된다. (3월의 인보이스가 만들어짐)
   *
   *  ------------------
   * P.S. 일광 절약 시간제때문에 시차가 변화되어 년/월/일만 받아서 04:00:00시간으로 하드코딩 하는것은 불가능
   */
  async findJobsToInvoice(clientOrganizationId: string, serviceMonth: Date): Promise<JobEntity[]> {
    const prerequisiteTasks = await this.prismaService.prerequisiteTasks.findMany()
    const records = await this.prismaService.orderedJobs.findMany({
      where: {
        clientOrganizationId: clientOrganizationId,
        dateSentToClient: {
          /**
           * 처음 로직
           */
          // gte: zonedTimeToUtc(startOfMonth(serviceMonth), 'Etc/UTC'),
          // lte: zonedTimeToUtc(endOfMonth(serviceMonth), 'Etc/UTC'), // serviceMonth가 UTC이니까 UTC를 UTC로 바꾸면 그대로.

          /**
           * 클라이언트에서 일광절약시간 기준으로 선택해서 UTC로 변환해서 넘겨줘야함
           */
          // gte: serviceMonth,
          // lte: addMonths(serviceMonth, 1), // serviceMonth가 UTC이니까 UTC를 UTC로 바꾸면 그대로.

          // 임시로 04시 더함 (클라이언트에서 UTC 00:00:00으로 보내주고있음)
          gte: convertTo(serviceMonth),
          lte: convertTo(addMonths(serviceMonth, 1)), // serviceMonth가 UTC이니까 UTC를 UTC로 바꾸면 그대로.
        },
        jobStatus: {
          in: [AutoOnlyJobStatusEnum.Sent_To_Client, JobStatusEnum.Canceled_Invoice],
        },
        invoiceId: null,
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
      orderBy: {
        dateSentToClient: 'asc',
      },
    })
    return records.map((rec) => this.jobMapper.toDomain({ ...rec, prerequisiteTasks }))
  }
}

function convertTo(date: Date): Date {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const day = date.getUTCDate()

  // Create a new Date object for the first day of the month at 00:00:00 UTC
  const utcDate = new Date(Date.UTC(year, month, day, 4, 0, 0))

  return utcDate
}
