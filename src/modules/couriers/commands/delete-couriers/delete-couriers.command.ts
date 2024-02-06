import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteCouriersCommand {
  readonly couriersId: string
  constructor(props: DeleteCouriersCommand) {
    initialize(this, props)
  }
}
