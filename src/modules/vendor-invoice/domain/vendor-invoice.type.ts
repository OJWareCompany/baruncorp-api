export interface CreateVendorInvoiceProps {
  organizationId: string
  organizationName: string
  daysPastDue: Date | null
  invoiceDate: Date
  invoiceNumber: string
  terms: number
  note: string | null
  serviceMonth: Date
  subTotal: number // 파악 필요
  total: number // 지불 금액
  invoiceTotalDifference: number // 파악 필요
  internalTotalBalanceDue: number | null // 파악 필요, 크레딧과 관련있어보임
  countLineItems: number
}
export interface VendorInvoiceProps extends CreateVendorInvoiceProps {
  dueDate: Date | null
  transactionType: string | null // Payment, Vendor Credit
}
