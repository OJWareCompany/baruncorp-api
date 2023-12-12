import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteVendorInvoiceCommand {
  readonly vendorInvoiceId: string
  constructor(props: DeleteVendorInvoiceCommand) {
    initialize(this, props)
  }
}
