import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteCustomPricingCommand {
  readonly customPricingId: string
  constructor(props: DeleteCustomPricingCommand) {
    initialize(this, props)
  }
}
