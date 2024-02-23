import { initialize } from '../../../../libs/utils/constructor-initializer'
import { VendorInvoiceTermsEnum } from '../../domain/vendor-invoice.type'

export class UpdateVendorInvoiceCommand {
  readonly vendorInvoiceId: string
  readonly invoiceDate: Date
  readonly terms: VendorInvoiceTermsEnum
  readonly note: string | null
  constructor(props: UpdateVendorInvoiceCommand) {
    initialize(this, props)
  }
}
