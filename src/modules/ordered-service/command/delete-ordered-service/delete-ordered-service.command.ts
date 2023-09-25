import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteOrderedServiceCommand {
  readonly orderedServiceId: string
  constructor(props: DeleteOrderedServiceCommand) {
    initialize(this, props)
  }
}
