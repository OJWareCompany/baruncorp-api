import { Inject } from '@nestjs/common'
import { CreditTransactionRepositoryPort } from '../../database/credit-transaction.repository.port'
import { CREDIT_TRANSACTION_REPOSITORY } from '../../credit-transaction.di-token'

/* eslint-disable @typescript-eslint/ban-ts-comment */
export class CreditCalculator {
  constructor(
    // @ts-ignore
    @Inject(CREDIT_TRANSACTION_REPOSITORY) private readonly creditTransactionRepo: CreditTransactionRepositoryPort,
  ) {}

  async isAfford(
    clientOrganizationId: string,
    amount: number,
  ): Promise<{
    isAfford: boolean
    insufficientAmount: number
  }> {
    const creditHistory = await this.creditTransactionRepo.find(clientOrganizationId)
    const remainingCredit = creditHistory //
      .filter((credit) => credit.isValid)
      .reduce((pre, cur) => pre + cur.amount, 0)

    return {
      isAfford: remainingCredit - amount >= 0,
      insufficientAmount: amount - remainingCredit,
    }
  }
}
