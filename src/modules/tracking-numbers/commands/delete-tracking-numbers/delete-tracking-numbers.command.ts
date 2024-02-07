import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteTrackingNumbersCommand {
  readonly trackingNumbersId: string
  constructor(props: DeleteTrackingNumbersCommand) {
    initialize(this, props)
  }
}
