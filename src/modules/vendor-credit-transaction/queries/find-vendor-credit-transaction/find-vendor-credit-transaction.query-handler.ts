import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { VendorCreditTransactions } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { VendorCreditTransactionNotFoundException } from '../../domain/vendor-credit-transaction.error'

export class FindVendorCreditTransactionQuery {
  readonly vendorCreditTransactionId: string
  constructor(props: FindVendorCreditTransactionQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindVendorCreditTransactionQuery)
export class FindVendorCreditTransactionQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindVendorCreditTransactionQuery): Promise<VendorCreditTransactions> {
    const result = await this.prismaService.vendorCreditTransactions.findUnique({
      where: { id: query.vendorCreditTransactionId },
    })
    if (!result) throw new VendorCreditTransactionNotFoundException()
    return result
  }
}
