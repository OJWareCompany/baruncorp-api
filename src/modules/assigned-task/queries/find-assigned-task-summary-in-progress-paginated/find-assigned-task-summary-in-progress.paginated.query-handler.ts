import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { AssignedTasks, OrderedServices, Prisma, Users } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskStatusEnum } from '../../domain/assigned-task.type'
import { AssignedTaskSummaryInProgressResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-in-progress.response.dto'
import { UserStatusEnum } from '@modules/users/domain/user.types'

export class FindAssignedTaskSummaryInProgressPaginatedQuery extends PaginatedQueryBase {
  readonly organizationName?: string | null
  readonly userName?: string | null
  constructor(props: PaginatedParams<FindAssignedTaskSummaryInProgressPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindAssignedTaskSummaryInProgressPaginatedQuery)
export class FindAssignedTaskSummaryInProgressPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: FindAssignedTaskSummaryInProgressPaginatedQuery,
  ): Promise<Paginated<AssignedTaskSummaryInProgressResponseDto>> {
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
          organization: {
            organizationType: 'administration',
          },
        },
      ],
      status: UserStatusEnum.ACTIVE,
    }
    // 전체 유저 레코드 조회
    const userRecords = await this.prismaService.users.findMany({
      where: userCondition,
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
    })

    const promises: Promise<AssignedTaskSummaryInProgressResponseDto>[] = userRecords.map(async (record) => {
      const assignedTaskCountCondition: Prisma.AssignedTasksWhereInput = {
        assigneeId: record.id,
      }

      const responseDto: AssignedTaskSummaryInProgressResponseDto = {
        userId: record.id,
        organizationName: record.organization.name,
        userName: record.full_name,
        inProgressAssignedTaskCount: await this.prismaService.assignedTasks.count({
          where: {
            ...assignedTaskCountCondition,
            status: AssignedTaskStatusEnum.In_Progress,
          },
        }),
      }
      return responseDto
    })

    const dtos: AssignedTaskSummaryInProgressResponseDto[] = await Promise.all(promises)
    // 조건을 만족하는 유저의 통계만 필터링
    const filteredDtos: AssignedTaskSummaryInProgressResponseDto[] = dtos.filter(
      (dto) => dto.inProgressAssignedTaskCount !== 0,
    )
    // 조건을 만족하는 유저의 총 수
    const totalValidCount: number = filteredDtos.length
    // 필요한 페이지 크기에 맞춰 데이터 반환
    const validResponseDtos: AssignedTaskSummaryInProgressResponseDto[] = filteredDtos.slice(
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
