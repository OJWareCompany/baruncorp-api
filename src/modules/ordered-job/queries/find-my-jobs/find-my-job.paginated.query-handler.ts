/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JobMapper } from '../../job.mapper'
import { OrderedJobs, OrderedServices, Service, AssignedTasks, Tasks, Users } from '@prisma/client'
import { JobStatusEnum } from '../../domain/job.type'

export class FindMyJobPaginatedQuery extends PaginatedQueryBase {
  readonly userId: string
  readonly jobStatus?: JobStatusEnum | null

  constructor(props: PaginatedParams<FindMyJobPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindMyJobPaginatedQuery)
export class FindMyJobPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindMyJobPaginatedQuery): Promise<
    Paginated<
      OrderedJobs & {
        orderedServices: (OrderedServices & {
          service: Service
          assignedTasks: (AssignedTasks & { task: Tasks; user: Users | null })[]
        })[]
      }
    >
  > {
    // TODO: totalCount때문에 풀스캔하게됨
    const condition = {
      ...(query.jobStatus && { jobStatus: query.jobStatus }),
      assignedTasks: {
        some: {
          assigneeId: query.userId,
        },
      },
    }

    const myJobs = await this.prismaService.orderedJobs.findMany({
      where: condition,
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

    const totalCount = await this.prismaService.orderedJobs.count({ where: condition })

    return new Paginated({
      items: myJobs,
      totalCount: totalCount,
      pageSize: query.limit,
      page: query.page,
    })
  }
}
