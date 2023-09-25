import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateOrderedServiceCommand {
  readonly orderedServiceId: string
  readonly priceOverride: number
  constructor(props: UpdateOrderedServiceCommand) {
    initialize(this, props)
  }
}
