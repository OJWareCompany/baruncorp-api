import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { AssignedTasks, Users } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'

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

  async execute(query: FindAssignedTaskPaginatedQuery): Promise<Paginated<AssignedTasks & { user: Users | null }>> {
    const result = await this.prismaService.assignedTasks.findMany({
      where: { jobId: query.jobId },
      include: { user: true },
      skip: query.offset,
      take: query.limit,
    })
    console.log(query.jobId)
    if (!result) throw new NotFoundException()
    const totalCount = await this.prismaService.assignedTasks.count({ where: { id: query.jobId } })
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
