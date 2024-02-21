import { Inject } from '@nestjs/common'
import { VendorCreditTransactionRepositoryPort } from '../../database/vendor-credit-transaction.repository.port'
import { VENDOR_CREDIT_TRANSACTION_REPOSITORY } from '../../vendor-credit-transaction.di-token'

/* eslint-disable @typescript-eslint/ban-ts-comment */
export class VendorCreditCalculator {
  constructor(
    // @ts-ignore
    @Inject(VENDOR_CREDIT_TRANSACTION_REPOSITORY)
    private readonly vendorCreditTransactionRepo: VendorCreditTransactionRepositoryPort,
  ) {}

  async isAfford(
    vendorOrganizationId: string,
    amount: number,
  ): Promise<{
    isAfford: boolean
    insufficientAmount: number
  }> {
    const creditHistory = await this.vendorCreditTransactionRepo.find(vendorOrganizationId)
    const remainingCredit = creditHistory //
      .filter((credit) => credit.isValid)
      .reduce((pre, cur) => pre + cur.amount, 0)

    return {
      isAfford: remainingCredit - amount >= 0,
      insufficientAmount: amount - remainingCredit,
    }
  }
}
