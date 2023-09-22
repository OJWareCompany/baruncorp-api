import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateServiceCommand {
  readonly name: string
  readonly billingCode: string
  readonly basePrice: number
  constructor(props: CreateServiceCommand) {
    initialize(this, props)
  }
}
