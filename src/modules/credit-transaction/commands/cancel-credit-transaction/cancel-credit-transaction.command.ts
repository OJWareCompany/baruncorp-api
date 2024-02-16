import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CancelCreditTransactionCommand {
  readonly creditTransactionId: string
  constructor(props: CancelCreditTransactionCommand) {
    initialize(this, props)
  }
}
