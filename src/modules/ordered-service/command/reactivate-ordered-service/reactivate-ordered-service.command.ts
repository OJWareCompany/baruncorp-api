import { initialize } from '../../../../libs/utils/constructor-initializer'

export class ReactivateOrderedServiceCommand {
  readonly orderedServiceId: string
  constructor(props: ReactivateOrderedServiceCommand) {
    initialize(this, props)
  }
}
