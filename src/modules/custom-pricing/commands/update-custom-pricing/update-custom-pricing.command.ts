import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateCustomPricingCommand {
  readonly customPricingId: string
  constructor(props: UpdateCustomPricingCommand) {
    initialize(this, props)
  }
}
