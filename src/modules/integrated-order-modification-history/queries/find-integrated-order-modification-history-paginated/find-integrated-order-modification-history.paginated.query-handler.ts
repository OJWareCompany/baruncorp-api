import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { IntegratedOrderModificationHistory } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { IntegratedOrderModificationHistoryNotFoundException } from '../../domain/integrated-order-modification-history.error'
import { ViewForbiddenException } from '../../../../libs/exceptions/exceptions'

export class FindIntegratedOrderModificationHistoryPaginatedQuery extends PaginatedQueryBase {
  readonly jobId: string
  readonly departmentId: string | null
  constructor(props: PaginatedParams<FindIntegratedOrderModificationHistoryPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindIntegratedOrderModificationHistoryPaginatedQuery)
export class FindIntegratedOrderModificationHistoryPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: FindIntegratedOrderModificationHistoryPaginatedQuery,
  ): Promise<Paginated<IntegratedOrderModificationHistory>> {
    const empty = new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: 0,
      items: [],
    })

    if (!query.departmentId) throw new ViewForbiddenException()

    const department = await this.prismaService.departments.findFirst({ where: { id: query.departmentId } })
    if (!department) throw new ViewForbiddenException()

    const canView = department.viewTaskCost && department.viewScopePrice
    if (!canView) throw new ViewForbiddenException()

    const result = await this.prismaService.integratedOrderModificationHistory.findMany({
      skip: query.offset,
      take: query.limit,
      where: { jobId: query.jobId },
      orderBy: { modifiedAt: 'desc' },
    })

    if (!result) throw new IntegratedOrderModificationHistoryNotFoundException()

    const totalCount = await this.prismaService.integratedOrderModificationHistory.count({
      where: { jobId: query.jobId },
    })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
