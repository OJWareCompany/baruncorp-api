export interface CreateVendorInvoiceProps {
  organizationId: string
  organizationName: string
  daysPastDue: Date | null
  invoiceDate: Date
  invoiceNumber: string
  terms: number
  note: string | null
  serviceMonth: Date
  subTotal: number
  total: number
  invoiceTotalDifference: number
  internalTotalBalanceDue: number | null
}
export interface VendorInvoiceProps extends CreateVendorInvoiceProps {
  dueDate: Date | null
}
