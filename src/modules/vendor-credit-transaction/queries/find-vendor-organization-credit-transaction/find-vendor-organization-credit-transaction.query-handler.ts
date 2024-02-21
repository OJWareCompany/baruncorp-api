import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { VendorCreditTransactionTypeEnum } from '../../domain/vendor-credit-transaction.type'

export class FindVendorOrganizationCreditTransactionQuery {
  readonly vendorOrganizationId: string
  constructor(props: FindVendorOrganizationCreditTransactionQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindVendorOrganizationCreditTransactionQuery)
export class FindOrganizationCreditTransactionQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindVendorOrganizationCreditTransactionQuery): Promise<number> {
    const result = await this.prismaService.vendorCreditTransactions.findMany({
      where: { vendorOrganizationId: query.vendorOrganizationId, canceledAt: null },
    })

    return result.reduce((pre, cur) => {
      const amount = cur.transactionType === VendorCreditTransactionTypeEnum.Reload ? cur.amount : -cur.amount
      return pre + Number(amount)
    }, 0)
  }
}
