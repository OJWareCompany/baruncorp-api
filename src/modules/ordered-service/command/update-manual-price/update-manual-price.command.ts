import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateManualPriceCommand {
  readonly orderedServiceId: string
  readonly price: number
  readonly editorUserId: string
  constructor(props: UpdateManualPriceCommand) {
    initialize(this, props)
  }
}
