import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { CreditTransactions } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { CreditTransactionNotFoundException } from '../../domain/credit-transaction.error'

export class FindCreditTransactionQuery {
  readonly creditTransactionId: string
  constructor(props: FindCreditTransactionQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindCreditTransactionQuery)
export class FindCreditTransactionQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindCreditTransactionQuery): Promise<CreditTransactions> {
    const result = await this.prismaService.creditTransactions.findUnique({ where: { id: query.creditTransactionId } })
    if (!result) throw new CreditTransactionNotFoundException()
    return result
  }
}
