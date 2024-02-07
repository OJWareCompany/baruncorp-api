import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateTrackingNumbersCommand {
  readonly trackingNumberId: string
  readonly courierId?: string
  readonly trackingNumber?: string
  constructor(props: UpdateTrackingNumbersCommand) {
    initialize(this, props)
  }
}
