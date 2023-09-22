import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateServiceCommand {
  readonly serviceId: string
  readonly name: string
  readonly billingCode: string
  readonly basePrice: number
  constructor(props: UpdateServiceCommand) {
    initialize(this, props)
  }
}
