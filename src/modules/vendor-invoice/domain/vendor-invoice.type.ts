export interface CreateVendorInvoiceProps {
  organizationId: string
  organizationName: string
  daysPastDue: Date | null
  invoiceDate: Date
  dueDate: Date | null
  invoiceNumber: string
  terms: number
  note: string | null
  serviceMonth: Date
  subTotal: number
  total: number
  invoiceTotalDifference: number
  internalTotalBalanceDue: number | null
}
export type VendorInvoiceProps = CreateVendorInvoiceProps
