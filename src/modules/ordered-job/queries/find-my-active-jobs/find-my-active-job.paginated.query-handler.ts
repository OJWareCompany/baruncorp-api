/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JobProps } from '../../domain/job.type'
import { JobMapper } from '../../job.mapper'
import { AssignedTaskStatusEnum } from '../../../assigned-task/domain/assigned-task.type'
import { OrderedJobs, OrderedServices, Service, AssignedTasks, Tasks, Users } from '@prisma/client'

export class FindMyActiveJobPaginatedQuery extends PaginatedQueryBase {
  readonly userId: string

  constructor(props: PaginatedParams<FindMyActiveJobPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindMyActiveJobPaginatedQuery)
export class FindMyActiveJobPaginatedQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly jobMapper: JobMapper,
  ) {}

  async execute(query: FindMyActiveJobPaginatedQuery): Promise<
    Paginated<
      OrderedJobs & {
        orderedServices: (OrderedServices & {
          service: Service
          assignedTasks: (AssignedTasks & { task: Tasks; user: Users | null })[]
        })[]
      }
    >
  > {
    // TODO: totalcount때문에 풀스캔하게됨
    const myActiveTasks = await this.prismaService.assignedTasks.findMany({
      where: {
        assigneeId: query.userId,
        status: { in: [AssignedTaskStatusEnum.Not_Started, AssignedTaskStatusEnum.In_Progress] },
      },
      include: {
        job: true,
      },
      orderBy: { startedAt: 'desc' },
      take: query.limit,
      skip: query.offset,
    })

    const jobIds = new Set<string>()
    myActiveTasks.map((task) => jobIds.add(task.jobId))
    console.log(jobIds)
    // TODO: totalcount때문에 풀스캔하게됨
    const myActiveJobs = await this.prismaService.orderedJobs.findMany({
      where: {
        id: { in: [...jobIds] },
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
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      skip: query.offset,
    })

    const totalCount = await this.prismaService.orderedJobs.count({ where: { id: { in: [...jobIds] } } })

    return new Paginated({
      items: myActiveJobs,
      totalCount: totalCount,
      pageSize: query.limit,
      page: query.page,
    })
  }
}
