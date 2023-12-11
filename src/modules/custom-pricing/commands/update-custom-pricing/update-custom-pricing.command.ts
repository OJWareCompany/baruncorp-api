import { initialize } from '../../../../libs/utils/constructor-initializer'
import { CreateCustomPricingCommand } from '../create-custom-pricing/create-custom-pricing.command'

// 나중에
export class UpdateCustomPricingCommand extends CreateCustomPricingCommand {
  constructor(props: UpdateCustomPricingCommand) {
    super(props)
    initialize(this, props)
  }
}
