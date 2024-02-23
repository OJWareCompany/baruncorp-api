import { VendorCreditTransactionTypeEnum } from '../../vendor-credit-transaction/domain/vendor-credit-transaction.type'

export type PaymentMethod = 'Direct'
export enum PaymentMethodEnum {
  Direct = 'Direct',
}

export type VendorInvoicePaymentType = PaymentMethodEnum | VendorCreditTransactionTypeEnum.Deduction

export interface CreateVendorPaymentProps {
  vendorInvoiceId: string
  amount: number
  paymentMethod: PaymentMethodEnum
  notes: string | null
  createdBy: string
}

export interface VendorPaymentProps extends CreateVendorPaymentProps {
  paymentDate: Date
  canceledAt: Date | null
}
