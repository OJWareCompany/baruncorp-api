import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { AssignedTasks, OrderedServices, Prisma, Users } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskNotFoundException } from '../../domain/assigned-task.error'
import { MountingType, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { AssignedTaskStatusEnum } from '../../domain/assigned-task.type'
import { PrerequisiteTaskVO } from '../../../ordered-job/domain/value-objects/assigned-task.value-object'

export class FindAssignedTaskPaginatedQuery extends PaginatedQueryBase {
  readonly projectNumber?: string | null
  readonly jobName?: string | null
  readonly assigneeName?: string | null
  readonly taskName?: string | null
  readonly serviceName?: string | null
  readonly organizationName?: string | null
  readonly status?: AssignedTaskStatusEnum | null
  readonly projectPropertyType?: ProjectPropertyTypeEnum | null
  readonly mountingType?: MountingType | null
  readonly isVendor?: boolean | null
  readonly isRevision?: boolean | null
  constructor(props: PaginatedParams<FindAssignedTaskPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindAssignedTaskPaginatedQuery)
export class FindAssignedTaskPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: FindAssignedTaskPaginatedQuery,
  ): Promise<Paginated<AssignedTasks & { prerequisiteTasks: PrerequisiteTaskVO[] }>> {
    const condition: Prisma.AssignedTasksWhereInput = {
      ...(query.projectNumber && { projectNumber: query.projectNumber }),
      ...(query.jobName && { jobName: query.jobName }),
      ...(query.assigneeName && { assigneeName: query.assigneeName }),
      ...(query.taskName && { taskName: query.taskName }),
      ...(query.serviceName && { serviceName: query.serviceName }),
      ...(query.organizationName && { organizationName: query.organizationName }),
      ...(query.status && { status: query.status }),
      ...(query.projectPropertyType && { projectPropertyType: query.projectPropertyType }),
      ...(query.mountingType && { mountingType: query.mountingType }),
      ...(query.isRevision !== undefined && query.isRevision !== null && { isRevision: query.isRevision }),
      ...(query.isVendor !== undefined && query.isVendor !== null && { isVendor: query.isVendor }),
    }
    const result = await this.prismaService.assignedTasks.findMany({
      where: condition,
      include: { user: true, orderedService: true },
      skip: query.offset,
      take: query.limit,
    })
    const preTasks = await this.prismaService.prerequisiteTasks.findMany()
    if (!result) throw new AssignedTaskNotFoundException()
    const totalCount = await this.prismaService.assignedTasks.count({ where: condition })
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result.map((item) => {
        return {
          ...item,
          prerequisiteTasks: preTasks.filter((pre) => (pre.taskId = item.taskId)),
        }
      }),
    })
  }
}
