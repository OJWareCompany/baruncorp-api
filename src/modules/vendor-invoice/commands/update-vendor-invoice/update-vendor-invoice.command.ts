import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateVendorInvoiceCommand {
  readonly vendorInvoiceId: string
  constructor(props: UpdateVendorInvoiceCommand) {
    initialize(this, props)
  }
}
