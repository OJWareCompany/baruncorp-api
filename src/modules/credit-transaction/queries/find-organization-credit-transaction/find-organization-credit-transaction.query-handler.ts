import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { CreditTransactionTypeEnum } from '../../domain/credit-transaction.type'

export class FindOrganizationCreditTransactionQuery {
  readonly organizationId: string
  constructor(props: FindOrganizationCreditTransactionQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindOrganizationCreditTransactionQuery)
export class FindOrganizationCreditTransactionQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindOrganizationCreditTransactionQuery): Promise<number> {
    const result = await this.prismaService.creditTransactions.findMany({
      where: { clientOrganizationId: query.organizationId, canceledAt: null },
    })

    return result.reduce((pre, cur) => {
      const amount = cur.transactionType === CreditTransactionTypeEnum.Reload ? cur.amount : -cur.amount
      return pre + Number(amount)
    }, 0)
  }
}
