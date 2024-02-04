import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskStatusEnum } from '../../domain/assigned-task.type'

import { AssignedTaskSummaryDetailResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-detail.response.dto'

export class FindAssignedTaskSummaryDetailPaginatedQuery extends PaginatedQueryBase {
  readonly userId: string
  readonly status?: AssignedTaskStatusEnum
  constructor(props: PaginatedParams<FindAssignedTaskSummaryDetailPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindAssignedTaskSummaryDetailPaginatedQuery)
export class FindAssignedTaskSummaryDetailPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: FindAssignedTaskSummaryDetailPaginatedQuery,
  ): Promise<Paginated<AssignedTaskSummaryDetailResponseDto>> {
    const condition: Prisma.AssignedTasksWhereInput = {
      assigneeId: query.userId,
      ...(query.status && { status: query.status }),
    }

    const records = await this.prismaService.assignedTasks.findMany({
      where: condition,
      select: {
        taskName: true,
        jobName: true,
        jobId: true,
        status: true,
      },
      skip: query.offset,
      take: query.limit,
    })

    const totalCount: number = await this.prismaService.assignedTasks.count({ where: condition })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: records.map((record) => {
        const dto: AssignedTaskSummaryDetailResponseDto = {
          jobId: record.jobId,
          jobName: record.jobName,
          taskName: record.taskName,
          status: record.status as AssignedTaskStatusEnum,
        }

        return dto
      }),
    })
  }
}
