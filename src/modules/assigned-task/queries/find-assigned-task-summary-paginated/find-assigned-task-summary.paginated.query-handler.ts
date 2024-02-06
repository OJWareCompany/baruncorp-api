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
import { AssignedTaskSummaryResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary.response.dto'
import { response } from 'express'
import { addDays } from 'date-fns'

export class FindAssignedTaskSummaryPaginatedQuery extends PaginatedQueryBase {
  readonly organizationName?: string | null
  readonly userName?: string | null
  readonly startedAt?: Date | null
  readonly endedAt?: Date | null
  constructor(props: PaginatedParams<FindAssignedTaskSummaryPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindAssignedTaskSummaryPaginatedQuery)
export class FindAssignedTaskSummaryPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindAssignedTaskSummaryPaginatedQuery): Promise<Paginated<AssignedTaskSummaryResponseDto>> {
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

    const promises: Promise<AssignedTaskSummaryResponseDto>[] = userRecords.map(async (record) => {
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
        },
      })

      const responseDto: AssignedTaskSummaryResponseDto = {
        userId: record.id,
        organizationName: record.organization.name,
        userName: record.full_name,
        allAssignedTaskCount: allAssignedTaskCount,
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

    const dtos: AssignedTaskSummaryResponseDto[] = await Promise.all(promises)
    // 조건을 만족하는 유저의 통계만 필터링
    const filteredDtos: AssignedTaskSummaryResponseDto[] = dtos.filter((dto) => dto.allAssignedTaskCount !== 0)
    // 조건을 만족하는 유저의 총 수
    const totalValidCount: number = filteredDtos.length
    // 필요한 페이지 크기에 맞춰 데이터 반환
    const validResponseDtos: AssignedTaskSummaryResponseDto[] = filteredDtos.slice(
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
