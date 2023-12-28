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
import { OrderedJobs, OrderedServices, Service, AssignedTasks, Tasks, Users, Prisma } from '@prisma/client'
import { ProjectPropertyTypeEnum, MountingTypeEnum } from '../../../project/domain/project.type'
import { JobStatusEnum } from '../../domain/job.type'

export class FindMyOrderedJobPaginatedQuery extends PaginatedQueryBase {
  readonly userId: string
  readonly projectNumber?: string | null
  readonly jobName?: string | null
  readonly propertyFullAddress?: string | null
  readonly projectPropertyType?: ProjectPropertyTypeEnum | null
  readonly jobStatus?: JobStatusEnum | null
  readonly mountingType?: MountingTypeEnum | null
  readonly isExpedited?: boolean | null

  constructor(props: PaginatedParams<FindMyOrderedJobPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}
@QueryHandler(FindMyOrderedJobPaginatedQuery)
export class FindMyOrderedJobPaginatedQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly jobMapper: JobMapper,
  ) {}

  async execute(query: FindMyOrderedJobPaginatedQuery): Promise<
    Paginated<
      OrderedJobs & {
        orderedServices: (OrderedServices & {
          service: Service
          assignedTasks: (AssignedTasks & { task: Tasks; user: Users | null })[]
        })[]
      }
    >
  > {
    const condition: Prisma.OrderedJobsWhereInput = {
      clientUserId: query.userId,
      ...(query.projectNumber && { projectNumber: { contains: query.projectNumber } }),
      ...(query.jobName && { jobName: { contains: query.jobName } }),
      ...(query.propertyFullAddress && { propertyFullAddress: { contains: query.propertyFullAddress } }),
      ...(query.projectPropertyType && { projectType: query.projectPropertyType }),
      ...(query.jobStatus && { jobStatus: query.jobStatus }),
      ...(query.mountingType && { mountingType: query.mountingType }),
      ...(query.isExpedited !== undefined && query.isExpedited !== null && { isExpedited: query.isExpedited }),
    }
    const myOrderedJobs = await this.prismaService.orderedJobs.findMany({
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

    const totalCount = await this.prismaService.orderedJobs.count({
      where: condition,
    })

    return new Paginated({
      items: myOrderedJobs,
      totalCount: totalCount,
      pageSize: query.limit,
      page: query.page,
    })
  }
}
