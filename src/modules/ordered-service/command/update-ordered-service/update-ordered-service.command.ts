import { initialize } from '../../../../libs/utils/constructor-initializer'
import { OrderedServiceSizeForRevisionEnum } from '../../domain/ordered-service.type'

export class UpdateOrderedServiceCommand {
  readonly orderedServiceId: string
  readonly description: string | null
  constructor(props: UpdateOrderedServiceCommand) {
    initialize(this, props)
  }
}
