import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CancelPaymentCommand {
  readonly paymentId: string
  constructor(props: CancelPaymentCommand) {
    initialize(this, props)
  }
}
