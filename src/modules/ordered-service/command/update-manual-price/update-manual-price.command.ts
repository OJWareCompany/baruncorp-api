import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateManualPriceCommand {
  readonly orderedServiceId: string
  readonly price: number
  constructor(props: UpdateManualPriceCommand) {
    initialize(this, props)
  }
}
