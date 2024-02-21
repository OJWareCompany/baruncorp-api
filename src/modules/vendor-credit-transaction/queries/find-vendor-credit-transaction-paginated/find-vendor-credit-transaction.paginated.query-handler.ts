import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { VendorCreditTransactions } from '@prisma/client'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'

export class FindVendorCreditTransactionPaginatedQuery extends PaginatedQueryBase {
  readonly vendorOrganizationId?: string | null
  constructor(props: PaginatedParams<FindVendorCreditTransactionPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindVendorCreditTransactionPaginatedQuery)
export class FindVendorCreditTransactionPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindVendorCreditTransactionPaginatedQuery): Promise<Paginated<VendorCreditTransactions>> {
    const result = await this.prismaService.vendorCreditTransactions.findMany({
      where: {
        ...(query.vendorOrganizationId && { vendorOrganizationId: query.vendorOrganizationId }),
      },
      skip: query.offset,
      take: query.limit,
      orderBy: { transactionDate: 'desc' },
    })
    const totalCount = await this.prismaService.vendorCreditTransactions.count({
      where: {
        ...(query.vendorOrganizationId && { vendorOrganizationId: query.vendorOrganizationId }),
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
