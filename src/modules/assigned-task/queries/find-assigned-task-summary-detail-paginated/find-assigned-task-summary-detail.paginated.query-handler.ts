import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskStatusEnum } from '../../domain/assigned-task.type'

import { AssignedTaskSummaryDetailResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-detail.response.dto'
import { addDays } from 'date-fns'

export class FindAssignedTaskSummaryDetailPaginatedQuery extends PaginatedQueryBase {
  readonly userId: string
  readonly status?: AssignedTaskStatusEnum
  readonly startedAt?: Date | null
  readonly endedAt?: Date | null
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
    let condition: Prisma.AssignedTasksWhereInput = {
      assigneeId: query.userId,
      ...(query.status && {
        status: query.status,
      }),
    }

    if (query.status === AssignedTaskStatusEnum.Completed || query.status === AssignedTaskStatusEnum.Canceled) {
      condition = {
        ...condition,
        ...(query.startedAt && {
          doneAt: {
            gte: query.startedAt,
          },
        }),
        ...(query.endedAt && {
          doneAt: {
            ...(query.startedAt && { gte: query.startedAt }),
            lt: addDays(query.endedAt, 1),
          },
        }),
      }
    } else {
      condition = {
        ...condition,
        ...(query.startedAt && {
          created_at: {
            gte: query.startedAt,
          },
        }),
        ...(query.endedAt && {
          created_at: {
            ...(query.startedAt && { gte: query.startedAt }),
            lt: addDays(query.endedAt, 1),
          },
        }),
      }
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
