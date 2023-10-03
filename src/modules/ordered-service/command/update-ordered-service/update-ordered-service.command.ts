import { initialize } from '../../../../libs/utils/constructor-initializer'
import { OrderedServiceSizeForRevisionEnum } from '../../domain/ordered-service.type'

export class UpdateOrderedServiceCommand {
  readonly orderedServiceId: string
  readonly priceOverride: number
  readonly description: string | null
  readonly sizeForRevision: OrderedServiceSizeForRevisionEnum | null
  constructor(props: UpdateOrderedServiceCommand) {
    initialize(this, props)
  }
}
