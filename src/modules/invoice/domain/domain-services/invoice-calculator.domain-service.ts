import { Inject } from '@nestjs/common'
import { CreditTransactionRepositoryPort } from '../../../credit-transaction/database/credit-transaction.repository.port'
import { CREDIT_TRANSACTION_REPOSITORY } from '../../../credit-transaction/credit-transaction.di-token'
import { PaymentRepositoryPort } from '../../../payment/database/payment.repository.port'
import { PAYMENT_REPOSITORY } from '../../../payment/payment.di-token'
import { InvoiceEntity } from '../invoice.entity'
import { CreditTransactionTypeEnum } from '../../../credit-transaction/domain/credit-transaction.type'

/* eslint-disable @typescript-eslint/ban-ts-comment */
export class InvoiceCalculator {
  constructor(
    // @ts-ignore
    @Inject(PAYMENT_REPOSITORY) private readonly paymentRepo: PaymentRepositoryPort, // @ts-ignore
    // @ts-ignore
    @Inject(CREDIT_TRANSACTION_REPOSITORY) private readonly clientCreditRepo: CreditTransactionRepositoryPort, // @ts-ignore
  ) {}

  async isValidAmount(invoice: InvoiceEntity, amount: number): Promise<{ isValid: boolean; exceededAmount: number }> {
    const paymentAmount = await this.calcAmountPaid(invoice)
    const creditPaymentAmount = await this.calcAppliedCredit(invoice)
    const totalPaidAmount = paymentAmount + creditPaymentAmount + amount
    return {
      isValid: invoice.total >= totalPaidAmount,
      exceededAmount: totalPaidAmount - invoice.total,
    }
  }

  async calcPaymentTotal(invoice: InvoiceEntity) {
    const paymentAmount = await this.calcAmountPaid(invoice)
    const creditPaymentAmount = await this.calcAppliedCredit(invoice)
    return paymentAmount + creditPaymentAmount
  }

  async calcAmountPaid(invoice: InvoiceEntity): Promise<number> {
    const payments = await this.paymentRepo.findByInvoiceId(invoice.id)
    return payments //
      .filter((payment) => payment.isValid)
      .reduce((pre, cur) => pre + cur.amount, 0)
  }

  async calcAppliedCredit(invoice: InvoiceEntity): Promise<number> {
    const creditHistory = await this.clientCreditRepo.find(invoice.clientOrganizationId)
    return creditHistory //
      .filter(
        (credit) => credit.isValid && credit.getProps().creditTransactionType === CreditTransactionTypeEnum.Deduction,
      )
      .filter((credit) => credit.isMatched(invoice.id))
      .reduce((pre, cur) => pre + cur.amount * -1, 0)
  }
}
