import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateOrderedServiceCommand {
  readonly serviceId: string
  readonly jobId: string
  readonly description: string | null
  constructor(props: CreateOrderedServiceCommand) {
    initialize(this, props)
  }
}
