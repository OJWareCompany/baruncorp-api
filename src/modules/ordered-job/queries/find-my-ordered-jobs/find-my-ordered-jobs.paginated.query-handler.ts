/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { OrderedJobs, Prisma } from '@prisma/client'
import { ProjectPropertyTypeEnum, MountingTypeEnum } from '../../../project/domain/project.type'
import { AutoOnlyJobStatusEnum, JobStatusEnum } from '../../domain/job.type'
import { OrderedJobsPriorityEnum } from '../../domain/value-objects/priority.value-object'

export class FindMyOrderedJobPaginatedQuery extends PaginatedQueryBase {
  readonly userId: string
  readonly organizationId: string
  readonly projectNumber?: string | null
  readonly jobName?: string | null
  readonly propertyFullAddress?: string | null
  readonly projectPropertyType?: ProjectPropertyTypeEnum | null
  readonly jobStatus?: JobStatusEnum | AutoOnlyJobStatusEnum | null
  readonly mountingType?: MountingTypeEnum | null
  readonly isExpedited?: boolean | null
  readonly propertyOwner?: string | null
  readonly inReview?: boolean | null
  readonly priority?: OrderedJobsPriorityEnum | null
  readonly taskName?: string | null
  readonly taskAssigneeName?: string | null
  readonly dateSentToClientStart?: Date | null
  readonly dateSentToClientEnd?: Date | null

  constructor(props: PaginatedParams<FindMyOrderedJobPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}
@QueryHandler(FindMyOrderedJobPaginatedQuery)
export class FindMyOrderedJobPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindMyOrderedJobPaginatedQuery): Promise<Paginated<OrderedJobs>> {
    const taskName = query.taskName ? { taskName: { contains: query.taskName } } : undefined
    const assigneeName = query.taskAssigneeName ? { assigneeName: { contains: query.taskAssigneeName } } : undefined

    const condition: Prisma.OrderedJobsWhereInput = {
      clientOrganizationId: query.organizationId,
      ...(query.projectNumber && { project_number: { contains: query.projectNumber } }),
      ...(query.jobName && { jobName: { contains: query.jobName } }),
      ...(query.propertyFullAddress && { propertyFullAddress: { contains: query.propertyFullAddress } }),
      ...(query.projectPropertyType && { projectType: query.projectPropertyType }),
      ...(query.jobStatus && { jobStatus: query.jobStatus }),
      ...(query.mountingType && { mountingType: query.mountingType }),
      ...(query.propertyOwner && { propertyOwner: { contains: query.propertyOwner } }),
      ...(query.priority && { priority: query.priority }),
      ...(query.isExpedited !== undefined && query.isExpedited !== null && { isExpedited: query.isExpedited }),
      ...(query.inReview !== undefined && query.inReview !== null && { inReview: query.inReview }),

      ...(query.dateSentToClientStart &&
        query.dateSentToClientEnd && {
          dateSentToClient: {
            gte: query.dateSentToClientStart,
            lte: query.dateSentToClientEnd,
          },
        }),
      /**
       * 검색한 태스크명을 가진 태스크가 포함되었으면서
       * 검색한 작업자명을 가진 태스크가 포함된 잡
       * (태스크명+작업자명을 가진 태스크가 포함된 잡을 검색하는게 아님)
       */
      AND: [{ assignedTasks: { some: taskName } }, { assignedTasks: { some: assigneeName } }],
    }

    const myOrderedJobs = await this.prismaService.orderedJobs.findMany({
      where: condition,
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
