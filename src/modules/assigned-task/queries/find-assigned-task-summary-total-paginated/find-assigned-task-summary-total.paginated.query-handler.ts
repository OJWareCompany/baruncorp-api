import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskStatusEnum } from '../../domain/assigned-task.type'
import { addDays } from 'date-fns'
import { UserStatusEnum } from '@modules/users/domain/user.types'
import {
  AssignedTaskSummaryTotalResponseDto,
  CompletedTaskCountDto,
} from '@modules/assigned-task/dtos/assigned-task-summary-total.response.dto'

export class FindAssignedTaskSummaryTotalPaginatedQuery extends PaginatedQueryBase {
  readonly startedAt?: Date | null
  readonly endedAt?: Date | null
  constructor(props: PaginatedParams<FindAssignedTaskSummaryTotalPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindAssignedTaskSummaryTotalPaginatedQuery)
export class FindAssignedTaskSummaryTotalPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: FindAssignedTaskSummaryTotalPaginatedQuery,
  ): Promise<Paginated<AssignedTaskSummaryTotalResponseDto>> {
    const userCondition: Prisma.UsersWhereInput = {
      OR: [
        {
          isVendor: true,
        },
        {
          organization: {
            organizationType: 'administration',
          },
        },
      ],
      status: UserStatusEnum.ACTIVE,
    }
    // 유저 레코드 조회
    const userRecords = await this.getUserRecords(userCondition, query.offset, query.limit)
    const totalCount: number = await this.prismaService.users.count({ where: userCondition })
    // Task 종류 조회
    const tasks: { id: string; name: string }[] = await this.prismaService.tasks.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    const promises: Promise<AssignedTaskSummaryTotalResponseDto>[] = userRecords.map(async (userRecord) => {
      // 해당 유저가 수행한 완료 태스크 데이터 가져온다.
      const targetUserTasks = await this.getCompletedTasks(userRecord.id, query.startedAt, query.endedAt)
      // 각각의 태스크 별로 갯수 정리
      const completedTaskCountDto: CompletedTaskCountDto[] = []
      for (const task of tasks) {
        const count: number = targetUserTasks.filter((targetUserTask) => targetUserTask.taskId === task.id).length
        completedTaskCountDto.push({
          taskId: task.id,
          taskName: task.name,
          count: count,
        })
      }
      // 해당 유저의 이름과 태스크 완료 내용을 반환
      const response: AssignedTaskSummaryTotalResponseDto = new AssignedTaskSummaryTotalResponseDto({
        userId: userRecord.id,
        userName: userRecord.full_name,
        tasks: completedTaskCountDto,
      })

      return response
    })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: await Promise.all(promises),
    })
  }

  async getUserRecords(whereCondition: Prisma.UsersWhereInput, offset: number, limit: number) {
    const userRecords = await this.prismaService.users.findMany({
      where: whereCondition,
      select: {
        id: true,
        full_name: true,
        organization: {
          select: {
            name: true,
            organizationType: true,
          },
        },
      },
      orderBy: [
        {
          full_name: 'asc',
        },
        {
          organization: {
            name: 'asc',
          },
        },
      ],
      skip: offset,
      take: limit,
    })

    return userRecords
  }

  async getCompletedTasks(userId: string, startedAt: Date | null | undefined, endedAt: Date | null | undefined) {
    return this.prismaService.assignedTasks.findMany({
      where: {
        assigneeId: userId,
        status: AssignedTaskStatusEnum.Completed,
        ...(startedAt && {
          doneAt: {
            gte: startedAt,
          },
        }),
        ...(endedAt && {
          doneAt: {
            ...(startedAt && { gte: startedAt }),
            lt: addDays(endedAt, 1),
          },
        }),
      },
    })
  }
}
