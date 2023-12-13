export type PaymentMethod = 'Credit' | 'Direct'
export enum PaymentMethodEnum {
  Credit = 'Credit',
  Direct = 'Direct',
}

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
