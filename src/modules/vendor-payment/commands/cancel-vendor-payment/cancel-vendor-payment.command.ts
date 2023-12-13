import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CancelVendorPaymentCommand {
  readonly vendorPaymentId: string
  constructor(props: CancelVendorPaymentCommand) {
    initialize(this, props)
  }
}
