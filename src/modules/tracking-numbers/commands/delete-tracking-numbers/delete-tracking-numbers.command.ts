import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteTrackingNumbersCommand {
  readonly trackingNumberId: string
  constructor(props: DeleteTrackingNumbersCommand) {
    initialize(this, props)
  }
}
