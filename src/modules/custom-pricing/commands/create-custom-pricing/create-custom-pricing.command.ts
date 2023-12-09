import { initialize } from '../../../../libs/utils/constructor-initializer'

export enum CustomPricingTypeEnum {
  custom_standard = 'Custom Standard',
  custom_fixed = 'Custom Fixed',
}

export enum ResidentialNewServicePricingTypeEnum {
  tier = 'Tier',
  flat = 'Flat',
}

export class CreateCustomPricingCommand {
  readonly serviceId: string
  readonly organizationId: string
  readonly type: CustomPricingTypeEnum
  readonly residentialNewServicePricingType: ResidentialNewServicePricingTypeEnum | null
  readonly residentialNewServiceFlatPrice: number | null
  readonly residentialNewServiceFlatGmPrice: number | null
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
