import { initialize } from '../../../../libs/utils/constructor-initializer'
import { ServicePricingTypeEnum } from '../../domain/service.type'

export class UpdateServiceCommand {
  readonly serviceId: string
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
  readonly residentialNewEstimatedTaskDuration: number | null
  readonly residentialRevisionEstimatedTaskDuration: number | null
  readonly commercialNewEstimatedTaskDuration: number | null
  readonly commercialRevisionEstimatedTaskDuration: number | null
  constructor(props: UpdateServiceCommand) {
    initialize(this, props)
  }
}
