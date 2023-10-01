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
}

export interface CreateInvoiceProps {
  invoiceDate: Date
  terms: InvoiceTermsEnum
  notesToClient: string | null
  clientOrganizationId: string
  serviceMonth: Date
}

export interface InvoiceProps extends CreateInvoiceProps {
  status: InvoiceStatusEnum
  dueDate: Date
}
