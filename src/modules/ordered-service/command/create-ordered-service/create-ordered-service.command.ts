import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateOrderedServiceCommand {
  readonly id: string
  constructor(props: CreateOrderedServiceCommand) {
    initialize(this, props)
  }
}
