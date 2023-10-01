import { initialize } from '../../../../libs/utils/constructor-initializer'
import { InvoiceTermsEnum } from '../../domain/invoice.type'

export class CreateInvoiceCommand {
  readonly invoiceDate: Date = new Date()
  readonly terms: InvoiceTermsEnum
  readonly notesToClient: string | null
  readonly clientOrganizationId: string
  readonly serviceMonth: Date
  constructor(props: CreateInvoiceCommand) {
    initialize(this, props)
  }
}
