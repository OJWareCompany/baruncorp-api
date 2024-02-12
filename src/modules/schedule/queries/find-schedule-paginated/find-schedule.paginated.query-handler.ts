import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { addDays } from 'date-fns'
import { UserStatusEnum } from '@modules/users/domain/user.types'
import { AssignedTaskSummaryTotalResponseDto } from '@modules/assigned-task/dtos/assigned-task-summary-total.response.dto'
import { ScheduleResponseDto } from '@modules/schedule/dtos/schedule.response.dto'
import { ScheduleDto } from '@modules/schedule/commands/update-information/put-schedule.request.dto'

export class FindSchedulePaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindSchedulePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindSchedulePaginatedQuery)
export class FindSchedulePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindSchedulePaginatedQuery): Promise<Paginated<ScheduleResponseDto>> {
    const userCondition: Prisma.UsersWhereInput = {
      email: {
        // Todo. 메일주소 말고 baruncorp 직원 판단 조건 확인 필요
        contains: 'baruncorp.com',
      },
      status: {
        not: UserStatusEnum.INACTIVE,
      },
    }
    // 유저 레코드 조회
    const records = await this.getUserRecords(userCondition, query.offset, query.limit)
    const totalCount: number = await this.prismaService.users.count({ where: userCondition })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: records.map((record) => {
        const response: ScheduleResponseDto = {
          userName: record.full_name,
          position: record.userPosition ? record.userPosition.position.name : '',
          schedules: record.userSchedule ? (record.userSchedule.schedules as unknown as ScheduleDto[]) : [],
        }
        return response
      }),
    })
  }

  async getUserRecords(whereCondition: Prisma.UsersWhereInput, offset: number, limit: number) {
    const userRecords = await this.prismaService.users.findMany({
      where: whereCondition,
      select: {
        id: true,
        full_name: true,
        userPosition: {
          select: {
            position: {
              select: {
                name: true,
              },
            },
          },
        },
        userSchedule: {
          select: {
            schedules: true,
          },
        },
      },
      orderBy: [
        {
          full_name: 'asc',
        },
        {
          userPosition: {
            position: {
              name: 'asc',
            },
          },
        },
      ],
      skip: offset,
      take: limit,
    })

    return userRecords
  }
}
