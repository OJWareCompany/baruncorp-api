import { EmailVO } from '../../users/domain/value-objects/email.vo'
import { InvoiceIssueHistory } from './value-objects/invoice-issue-history.value-object'
import { PaymentVO } from './value-objects/payment.value-object'

export type InvoiceStatus = 'Unissued' | 'Issued' | 'Paid'
export type InvoiceTerms = 21 | 30

export enum InvoiceStatusEnum {
  Unissued = 'Unissued',
  Issued = 'Issued',
  Paid = 'Paid',
}

export enum InvoiceTermsEnum {
  Days21 = 21,
  Days30 = 30,
  Days60 = 60,
}

export interface CreateInvoiceProps {
  invoiceDate: Date
  terms: InvoiceTermsEnum
  notesToClient: string | null
  clientOrganizationId: string
  organizationName: string
  serviceMonth: Date
  subTotal: number
  volumeTierDiscount: number
}

export interface InvoiceProps extends CreateInvoiceProps {
  total: number
  balanceDue: number
  status: InvoiceStatusEnum
  dueDate: Date
  paymentTotal: number
  payments: PaymentVO[]
  amountPaid: number
  appliedCredit: number
  issuedAt: Date | null
  currentCc: EmailVO[]
  invoiceIssueHistories: InvoiceIssueHistory[]
}
