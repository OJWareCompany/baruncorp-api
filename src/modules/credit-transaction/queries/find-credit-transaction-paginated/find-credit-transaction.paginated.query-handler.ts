import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { CreditTransactions } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { CreditTransactionNotFoundException } from '../../domain/credit-transaction.error'

export class FindCreditTransactionPaginatedQuery extends PaginatedQueryBase {
  // readonly creditTransactionId: string
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
      skip: query.offset,
      take: query.limit,
    })
    const totalCount = await this.prismaService.creditTransactions.count()
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
