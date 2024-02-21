import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { CreditTransactions } from '@prisma/client'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'

export class FindCreditTransactionPaginatedQuery extends PaginatedQueryBase {
  readonly organizationId?: string | null
  constructor(props: PaginatedParams<FindCreditTransactionPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindCreditTransactionPaginatedQuery)
export class FindCreditTransactionPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindCreditTransactionPaginatedQuery): Promise<Paginated<CreditTransactions>> {
    const result = await this.prismaService.creditTransactions.findMany({
      where: {
        ...(query.organizationId && { clientOrganizationId: query.organizationId }),
      },
      skip: query.offset,
      take: query.limit,
    })
    const totalCount = await this.prismaService.creditTransactions.count({
      where: {
        ...(query.organizationId && { clientOrganizationId: query.organizationId }),
      },
    })
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
