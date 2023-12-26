import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { Prisma, RejectedTaskReasons } from '@prisma/client'

export class FindRejectedTaskReasonPaginatedQuery extends PaginatedQueryBase {
  readonly username?: string | null
  constructor(props: PaginatedParams<FindRejectedTaskReasonPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}
@QueryHandler(FindRejectedTaskReasonPaginatedQuery)
export class FindRejectedTaskReasonPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(query: FindRejectedTaskReasonPaginatedQuery): Promise<Paginated<RejectedTaskReasons>> {
    const condition: Prisma.RejectedTaskReasonsWhereInput = {
      ...(query.username && { assigneeUserName: { contains: query.username } }),
    }
    const records = await this.prismaService.rejectedTaskReasons.findMany({
      skip: query.offset,
      take: query.limit,
      where: condition,
    })

    const totalCount = await this.prismaService.rejectedTaskReasons.count({
      where: condition,
    })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount,
      items: records,
    })
  }
}
