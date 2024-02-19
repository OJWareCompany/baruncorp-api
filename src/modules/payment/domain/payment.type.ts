import { CreditTransactionTypeEnum } from '../../credit-transaction/domain/credit-transaction.type'

// export type PaymentMethod = 'Credit' | 'Direct'
export enum PaymentMethodEnum {
  // Credit = 'Credit',
  Direct = 'Direct',
}

export type InvoicePaymentType = PaymentMethodEnum | CreditTransactionTypeEnum.Deduction

export interface CreatePaymentProps {
  invoiceId: string
  amount: number
  paymentMethod: PaymentMethodEnum
  notes: string | null
  createdBy: string
}

export interface PaymentProps extends CreatePaymentProps {
  paymentDate: Date
  canceledAt: Date | null
}
