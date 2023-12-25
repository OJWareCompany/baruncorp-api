import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { AssigningTaskAlerts } from '@prisma/client'

export class FindAssigningTaskAlertPaginatedQuery extends PaginatedQueryBase {
  readonly userId: string
  constructor(props: PaginatedParams<FindAssigningTaskAlertPaginatedQuery>) {
    super(props)
    this.userId = props.userId
  }
}

@QueryHandler(FindAssigningTaskAlertPaginatedQuery)
export class FindAssigningTaskAlertPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(query: FindAssigningTaskAlertPaginatedQuery): Promise<Paginated<AssigningTaskAlerts>> {
    const records = await this.prismaService.assigningTaskAlerts.findMany({
      where: { userId: query.userId },
      take: query.limit,
      skip: query.offset,
    })

    const totalCount = await this.prismaService.assigningTaskAlerts.count({
      where: { userId: query.userId },
    })

    return new Paginated<AssigningTaskAlerts>({
      page: query.page,
      pageSize: query.limit,
      totalCount,
      items: records,
    })
  }
}
