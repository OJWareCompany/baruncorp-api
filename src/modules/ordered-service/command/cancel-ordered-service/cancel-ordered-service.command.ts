import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CancelOrderedServiceCommand {
  readonly orderedServiceId: string
  constructor(props: CancelOrderedServiceCommand) {
    initialize(this, props)
  }
}
