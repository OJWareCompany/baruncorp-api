import { initialize } from '../../../../libs/utils/constructor-initializer'
import { ServicePricingTypeEnum } from '../../domain/service.type'

export class CreateServiceCommand {
  readonly name: string
  readonly billingCode: string
  readonly type: ServicePricingTypeEnum
  readonly residentialPrice: number | null
  readonly residentialGmPrice: number | null
  readonly residentialRevisionPrice: number | null
  readonly residentialRevisionGmPrice: number | null
  readonly commercialNewServiceTiers: {
    readonly startingPoint: number
    readonly finishingPoint: number
    readonly price: number
    readonly gmPrice: number
  }[]
  readonly commercialRevisionCostPerUnit: number | null
  readonly commercialRevisionMinutesPerUnit: number | null
  readonly fixedPrice: number | null
  constructor(props: CreateServiceCommand) {
    initialize(this, props)
  }
}
