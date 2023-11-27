import { initialize } from '../../../../libs/utils/constructor-initializer'
import { CustomPricingType } from '../create-custom-pricing/create-custom-pricing.command'

export class UpdateCustomPricingCommand {
  readonly customPricingId: string
  readonly type: CustomPricingType
  readonly residentialNewServiceTiers: {
    readonly startingPoint: number
    readonly finishingPoint: number
    readonly price: number
    readonly gmPrice: number
  }[]
  readonly residentialRevisionPrice: number | null
  readonly residentialRevisionGmPrice: number | null
  readonly commercialNewServiceTiers: {
    readonly startingPoint: number
    readonly finishingPoint: number
    readonly price: number
    readonly gmPrice: number
  }[]
  readonly fixedPrice: number | null
  constructor(props: UpdateCustomPricingCommand) {
    initialize(this, props)
  }
}
