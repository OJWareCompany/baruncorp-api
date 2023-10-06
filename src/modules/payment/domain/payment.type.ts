export type PaymentMethod = 'Credit' | 'Direct'
export enum PaymentMethodEnum {
  Credit = 'Credit',
  Direct = 'Direct',
}

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
