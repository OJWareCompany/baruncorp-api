export enum CreditTransactionTypeEnum {
  Reload = 'Reload',
  Deduction = 'Deduction',
}

export interface CreateCreditTransactionProps {
  clientOrganizationId: string
  createdBy: string
  createdByUserId: string
  amount: number
  creditTransactionType: CreditTransactionTypeEnum
  relatedInvoiceId?: string | null
}

export interface CreditTransactionProps extends CreateCreditTransactionProps {
  transactionDate: Date
  canceledAt: Date | null
}
