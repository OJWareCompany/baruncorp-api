import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateOrderedServiceCommand {
  readonly orderedServiceId: string
  readonly description: string | null
  constructor(props: UpdateOrderedServiceCommand) {
    initialize(this, props)
  }
}
