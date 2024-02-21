import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CancelVendorCreditTransactionCommand {
  readonly vendorCreditTransactionId: string
  constructor(props: CancelVendorCreditTransactionCommand) {
    initialize(this, props)
  }
}
