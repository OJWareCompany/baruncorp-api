import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateOrderedServiceCommand {
  readonly id: string
  constructor(props: UpdateOrderedServiceCommand) {
    initialize(this, props)
  }
}
