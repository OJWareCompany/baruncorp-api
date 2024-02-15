import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateVendorInvoicedTotalCommand {
  readonly vendorInvoiceId: string
  readonly total: number
  constructor(props: UpdateVendorInvoicedTotalCommand) {
    initialize(this, props)
  }
}
