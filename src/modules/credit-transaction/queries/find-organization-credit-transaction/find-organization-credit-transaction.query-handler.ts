import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

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
    const result = await this.prismaService.creditTransactions.aggregate({
      _sum: { amount: true },
      where: { clientOrganizationId: query.organizationId },
    })

    return Number(result._sum.amount)
  }
}
