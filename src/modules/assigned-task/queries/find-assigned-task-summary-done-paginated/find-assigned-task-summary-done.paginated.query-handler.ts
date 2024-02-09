import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { AssignedTasks, OrderedServices, Prisma, Users } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskStatusEnum } from '../../domain/assigned-task.type'
import { AssignedTaskSummaryDoneResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-done.response.dto'
import { addDays } from 'date-fns'
import { UserStatusEnum } from '@modules/users/domain/user.types'

export class FindAssignedTaskSummaryDonePaginatedQuery extends PaginatedQueryBase {
  readonly organizationName?: string | null
  readonly userName?: string | null
  readonly startedAt?: Date | null
  readonly endedAt?: Date | null
  constructor(props: PaginatedParams<FindAssignedTaskSummaryDonePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindAssignedTaskSummaryDonePaginatedQuery)
export class FindAssignedTaskSummaryDonePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: FindAssignedTaskSummaryDonePaginatedQuery,
  ): Promise<Paginated<AssignedTaskSummaryDoneResponseDto>> {
    const userCondition: Prisma.UsersWhereInput = {
      ...(query.userName && {
        full_name: {
          contains: query.userName,
        },
      }),
      ...(query.organizationName && {
        organization: {
          name: {
            contains: query.organizationName,
          },
        },
      }),
      OR: [
        {
          isVendor: true,
        },
        {
          email: {
            // Todo. 메일주소 말고 baruncorp 직원 판단 조건 확인 필요
            contains: 'baruncorp.com',
          },
        },
      ],
      status: UserStatusEnum.ACTIVE,
    }

    // 모든 유저 레코드 조회
    const userRecords = await this.prismaService.users.findMany({
      where: userCondition,
      select: {
        id: true,
        full_name: true,
        organization: {
          select: {
            name: true,
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
    })

    const promises: Promise<AssignedTaskSummaryDoneResponseDto>[] = userRecords.map(async (record) => {
      const assignedTaskCountCondition: Prisma.AssignedTasksWhereInput = {
        assigneeId: record.id,
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

      const allAssignedTaskCount: number = await this.prismaService.assignedTasks.count({
        where: {
          ...assignedTaskCountCondition,
          OR: [
            {
              status: AssignedTaskStatusEnum.Completed,
            },
            {
              status: AssignedTaskStatusEnum.Canceled,
            },
          ],
        },
      })

      const responseDto: AssignedTaskSummaryDoneResponseDto = {
        userId: record.id,
        organizationName: record.organization.name,
        userName: record.full_name,
        doneAssignedTaskCount: allAssignedTaskCount,
        completedAssignedTaskCount:
          allAssignedTaskCount !== 0
            ? await this.prismaService.assignedTasks.count({
                where: {
                  ...assignedTaskCountCondition,
                  status: AssignedTaskStatusEnum.Completed,
                },
              })
            : 0,
        canceledAssignedTaskCount:
          allAssignedTaskCount !== 0
            ? await this.prismaService.assignedTasks.count({
                where: {
                  ...assignedTaskCountCondition,
                  status: AssignedTaskStatusEnum.Canceled,
                },
              })
            : 0,
      }
      return responseDto
    })

    const dtos: AssignedTaskSummaryDoneResponseDto[] = await Promise.all(promises)
    // 조건을 만족하는 유저의 통계만 필터링
    const filteredDtos: AssignedTaskSummaryDoneResponseDto[] = dtos.filter((dto) => dto.doneAssignedTaskCount !== 0)
    // 조건을 만족하는 유저의 총 수
    const totalValidCount: number = filteredDtos.length
    // 필요한 페이지 크기에 맞춰 데이터 반환
    const validResponseDtos: AssignedTaskSummaryDoneResponseDto[] = filteredDtos.slice(
      query.offset,
      query.offset + query.limit,
    )
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalValidCount,
      items: validResponseDtos.slice(0, query.limit),
    })
  }
}
