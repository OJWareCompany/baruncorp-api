/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { OrderedJobs, Prisma } from '@prisma/client'
import { AutoOnlyJobStatusEnum, JobStatusEnum } from '../../domain/job.type'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { OrderedJobsPriorityEnum } from '../../domain/value-objects/priority.value-object'

export class FindMyJobPaginatedQuery extends PaginatedQueryBase {
  readonly userId: string
  readonly jobStatus?: JobStatusEnum | AutoOnlyJobStatusEnum | null
  readonly projectNumber?: string | null
  readonly jobName?: string | null
  readonly propertyFullAddress?: string | null
  readonly projectPropertyType?: ProjectPropertyTypeEnum | null
  readonly mountingType?: MountingTypeEnum | null
  readonly isExpedited?: boolean | null
  readonly propertyOwner?: string | null
  readonly inReview?: boolean | null
  readonly priority?: OrderedJobsPriorityEnum | null
  readonly orderBy: {
    field: keyof Pick<OrderedJobs, 'dateSentToClient' | 'completedCancelledDate' | 'dueDate' | 'createdAt'>
    param: 'asc' | 'desc'
  }
  readonly taskName?: string | null
  readonly taskAssigneeName?: string | null
  readonly clientOrganizationName?: string | null
  readonly dateSentToClientStart?: Date | null
  readonly dateSentToClientEnd?: Date | null

  constructor(props: PaginatedParams<FindMyJobPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindMyJobPaginatedQuery)
export class FindMyJobPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindMyJobPaginatedQuery): Promise<Paginated<OrderedJobs>> {
    // TODO: totalCount때문에 풀스캔하게됨
    const condition: Prisma.OrderedJobsWhereInput = {
      ...(query.jobStatus && { jobStatus: query.jobStatus }),
      ...(query.projectNumber && { project_number: { contains: query.projectNumber } }),
      ...(query.jobName && { jobName: { contains: query.jobName } }),
      ...(query.propertyFullAddress && { propertyFullAddress: { contains: query.propertyFullAddress } }),
      ...(query.projectPropertyType && { projectType: query.projectPropertyType }),
      ...(query.mountingType && { mountingType: query.mountingType }),
      ...(query.propertyOwner && { propertyOwner: { contains: query.propertyOwner } }),
      ...(query.priority && { priority: query.priority }),
      ...(query.isExpedited !== undefined && query.isExpedited !== null && { isExpedited: query.isExpedited }),
      ...(query.inReview !== undefined && query.inReview !== null && { inReview: query.inReview }),
      ...(query.clientOrganizationName && { clientOrganizationName: { contains: query.clientOrganizationName } }),
      assignedTasks: {
        some: {
          assigneeId: query.userId,
          ...(query.taskName && { taskName: { contains: query.taskName } }),
          ...(query.taskAssigneeName && { assigneeName: { contains: query.taskAssigneeName } }),
        },
      },

      ...(query.dateSentToClientStart &&
        query.dateSentToClientEnd && {
          dateSentToClient: {
            gte: query.dateSentToClientStart,
            lte: query.dateSentToClientEnd,
          },
        }),
    }

    const myJobs = await this.prismaService.orderedJobs.findMany({
      where: condition,
      orderBy: query.orderBy
        ? {
            [query.orderBy.field]: query.orderBy.param,
          }
        : [{ priorityLevel: 'asc' }, { dueDate: 'asc' }],
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
