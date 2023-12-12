import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateVendorInvoiceCommand {
  readonly organizationId: string
  readonly invoiceDate: Date
  readonly invoiceNumber: string
  readonly terms: number
  readonly note: string | null
  readonly serviceMonth: Date
  constructor(props: CreateVendorInvoiceCommand) {
    initialize(this, props)
  }
}
