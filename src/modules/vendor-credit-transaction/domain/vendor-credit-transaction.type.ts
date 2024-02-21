export enum VendorCreditTransactionTypeEnum {
  Reload = 'Reload',
  Deduction = 'Deduction',
}

export interface CreateVendorCreditTransactionProps {
  vendorOrganizationId: string
  createdBy: string
  createdByUserId: string
  amount: number
  creditTransactionType: VendorCreditTransactionTypeEnum
  relatedVendorInvoiceId?: string | null
  note: string | null
}

export interface VendorCreditTransactionProps extends CreateVendorCreditTransactionProps {
  transactionDate: Date
  canceledAt: Date | null
}
