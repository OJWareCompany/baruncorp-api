/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { OrderedJobs, OrderedServices, Service, AssignedTasks, Tasks, Users, Prisma } from '@prisma/client'
import { AutoOnlyJobStatusEnum, JobStatusEnum } from '../../domain/job.type'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'

export class FindJobPaginatedQuery extends PaginatedQueryBase {
  readonly projectNumber?: string | null
  readonly jobName?: string | null
  readonly propertyFullAddress?: string | null
  readonly projectPropertyType?: ProjectPropertyTypeEnum | null
  readonly jobStatus?: JobStatusEnum | AutoOnlyJobStatusEnum | null
  readonly mountingType?: MountingTypeEnum | null
  readonly isExpedited?: boolean | null

  constructor(props: PaginatedParams<FindJobPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindJobPaginatedQuery)
export class FindJobPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindJobPaginatedQuery): Promise<
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
      ...(query.projectNumber && { projectNumber: { contains: query.projectNumber } }),
      ...(query.jobName && { jobName: { contains: query.jobName } }),
      ...(query.propertyFullAddress && { propertyFullAddress: { contains: query.propertyFullAddress } }),
      ...(query.projectPropertyType && { projectType: query.projectPropertyType }),
      ...(query.jobStatus && { jobStatus: query.jobStatus }),
      ...(query.mountingType && { mountingType: query.mountingType }),
      ...(query.isExpedited !== undefined && query.isExpedited !== null && { isExpedited: query.isExpedited }),
    }

    const records: (OrderedJobs & {
      orderedServices: (OrderedServices & {
        service: Service
        assignedTasks: (AssignedTasks & { task: Tasks; user: Users | null })[]
      })[]
    })[] = await this.prismaService.orderedJobs.findMany({
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

    // TODO: totalcount때문에 풀스캔하게됨
    const totalCount = await this.prismaService.orderedJobs.count({ where: condition })

    return new Paginated({
      items: records,
      totalCount: totalCount,
      pageSize: query.limit,
      page: query.page,
    })
  }
}
