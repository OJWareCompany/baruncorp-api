import { Inject } from '@nestjs/common'
import { VendorInvoiceEntity } from '../vendor-invoice.entity'
import { VendorPaymentRepositoryPort } from '../../../vendor-payment/database/vendor-payment.repository.port'
import { VENDOR_PAYMENT_REPOSITORY } from '../../../vendor-payment/vendor-payment.di-token'
import { VendorCreditTransactionRepositoryPort } from '../../../vendor-credit-transaction/database/vendor-credit-transaction.repository.port'
import { VENDOR_CREDIT_TRANSACTION_REPOSITORY } from '../../../vendor-credit-transaction/vendor-credit-transaction.di-token'
import { VendorCreditTransactionTypeEnum } from '../../../vendor-credit-transaction/domain/vendor-credit-transaction.type'

/* eslint-disable @typescript-eslint/ban-ts-comment */
export class VendorInvoiceCalculator {
  constructor(
    // @ts-ignore
    @Inject(VENDOR_PAYMENT_REPOSITORY) private readonly vendorPaymentRepo: VendorPaymentRepositoryPort, // @ts-ignore
    // @ts-ignore
    @Inject(VENDOR_CREDIT_TRANSACTION_REPOSITORY)
    private readonly vendorCreditRepo: VendorCreditTransactionRepositoryPort, // @ts-ignore
  ) {}

  async isValidAmount(
    vendorInvoice: VendorInvoiceEntity,
    amount: number,
  ): Promise<{ isValid: boolean; exceededAmount: number }> {
    const paymentAmount = await this.calcPaymentAmount(vendorInvoice)
    const creditPaymentAmount = await this.calcCreditPaymentAmount(vendorInvoice)
    const totalPaidAmount = paymentAmount + creditPaymentAmount + amount
    return {
      isValid: vendorInvoice.total >= totalPaidAmount,
      exceededAmount: totalPaidAmount - vendorInvoice.total,
    }
  }

  async calcPaymentTotal(vendorInvoice: VendorInvoiceEntity) {
    const paymentAmount = await this.calcPaymentAmount(vendorInvoice)
    const creditPaymentAmount = await this.calcCreditPaymentAmount(vendorInvoice)
    return paymentAmount + creditPaymentAmount
  }

  private async calcPaymentAmount(vendorInvoice: VendorInvoiceEntity): Promise<number> {
    const vendorPayments = await this.vendorPaymentRepo.findByVendorInvoiceId(vendorInvoice.id)
    return vendorPayments //
      .filter((payment) => payment.isValid)
      .reduce((pre, cur) => pre + cur.amount, 0)
  }

  private async calcCreditPaymentAmount(vendorInvoice: VendorInvoiceEntity): Promise<number> {
    const creditHistory = await this.vendorCreditRepo.find(vendorInvoice.vendorOrganizationId)
    return creditHistory //
      .filter(
        (credit) =>
          credit.isValid && credit.getProps().creditTransactionType === VendorCreditTransactionTypeEnum.Deduction,
      )
      .filter((credit) => credit.isMatched(vendorInvoice.id))
      .reduce((pre, cur) => pre + cur.amount * -1, 0)
  }
}
