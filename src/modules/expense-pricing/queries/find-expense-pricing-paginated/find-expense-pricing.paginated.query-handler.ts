import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { EXPENSE_PRICING_REPOSITORY } from '../../expense-pricing.di-token'
import { ExpensePricingRepositoryPort } from '../../database/expense-pricing.repository.port'
import { ExpensePricingMapper } from '../../expense-pricing.mapper'
import { ExpensePricingResponseDto } from '../../dtos/expense-pricing.response.dto'

export class FindExpensePricingPaginatedQuery extends PaginatedQueryBase {
  readonly organizationId?: string | null
  readonly taskId?: string | null
  constructor(props: PaginatedParams<FindExpensePricingPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindExpensePricingPaginatedQuery)
export class FindExpensePricingPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly mapper: ExpensePricingMapper) {}

  async execute(query: FindExpensePricingPaginatedQuery): Promise<Paginated<ExpensePricingResponseDto>> {
    const result = await this.prismaService.expensePricings.findMany({
      skip: query.offset,
      take: query.limit,
      where: {
        ...(query.organizationId && { organizationId: query.organizationId }),
        ...(query.taskId && { taskId: query.taskId }),
      },
    })
    const totalCount = await this.prismaService.expensePricings.count({
      where: {
        ...(query.organizationId && { organizationId: query.organizationId }),
        ...(query.taskId && { taskId: query.taskId }),
      },
    })
    const entities = result.map(this.mapper.toDomain)
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: entities.map(this.mapper.toResponse),
    })
  }
}
