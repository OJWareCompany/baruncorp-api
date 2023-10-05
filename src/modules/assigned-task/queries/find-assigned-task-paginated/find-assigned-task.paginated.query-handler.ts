import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { AssignedTasks, OrderedServices, Users } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskNotFoundException } from '../../domain/assigned-task.error'

export class FindAssignedTaskPaginatedQuery extends PaginatedQueryBase {
  readonly jobId: string
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
  ): Promise<Paginated<AssignedTasks & { user: Users | null; orderedService: OrderedServices }>> {
    const result = await this.prismaService.assignedTasks.findMany({
      where: { jobId: query.jobId },
      include: { user: true, orderedService: true },
      skip: query.offset,
      take: query.limit,
    })
    if (!result) throw new AssignedTaskNotFoundException()
    const totalCount = await this.prismaService.assignedTasks.count({ where: { id: query.jobId } })
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
