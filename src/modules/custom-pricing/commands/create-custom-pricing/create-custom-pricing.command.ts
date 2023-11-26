import { initialize } from '../../../../libs/utils/constructor-initializer'

export enum CustomPricingType {
  custom_standard = 'custom_standard',
  custom_fixed = 'custom_fixed',
}

export class CreateCustomPricingCommand {
  readonly serviceId: string
  readonly organizationId: string
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
  constructor(props: CreateCustomPricingCommand) {
    initialize(this, props)
  }
}
