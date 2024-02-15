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
    const emailDomain = 'baruncorp.com'
    const inactiveStatus: UserStatusEnum = UserStatusEnum.INACTIVE

    const records: any[] = await this.prismaService.$queryRaw`
        SELECT 
            u.id        As userId,
            u.full_name AS userName,
            p.name AS positionName,
            s.schedules AS schedules
        FROM users u
        LEFT JOIN user_position up ON u.id = up.user_id
        LEFT JOIN positions p ON up.position_id = p.id
        LEFT JOIN user_schedules s ON u.id = s.id
        WHERE u.email LIKE CONCAT('%', ${emailDomain}, '%')
        AND u.status != ${inactiveStatus}
        ORDER BY CASE WHEN positionName IS NULL THEN 1 ELSE 0 END, positionName ASC, userName ASC
        LIMIT ${query.limit} OFFSET ${query.offset};
    `

    const totalCount: number = await this.prismaService.users.count({
      where: {
        email: {
          contains: emailDomain,
        },
        status: {
          not: inactiveStatus,
        },
      },
    })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: records.map((record) => {
        const response: ScheduleResponseDto = {
          userId: record.userId,
          name: record.userName,
          position: record.positionName ? record.positionName : '',
          schedules: record.schedules ? (JSON.parse(record.schedules) as ScheduleDto[]) : [],
        }

        return response
      }),
    })
  }
}
