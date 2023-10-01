import { initialize } from '../../../../libs/utils/constructor-initializer'
import { InvoiceTermsEnum } from '../../domain/invoice.type'

export class UpdateInvoiceCommand {
  readonly invoiceId: string
  readonly invoiceDate: Date
  readonly terms: InvoiceTermsEnum
  readonly notesToClient: string | null
  constructor(props: UpdateInvoiceCommand) {
    initialize(this, props)
  }
}
