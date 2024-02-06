import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateCouriersCommand {
  readonly courierId: string
  readonly name?: string
  readonly urlParam?: string
  constructor(props: UpdateCouriersCommand) {
    initialize(this, props)
  }
}
