import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateTrackingNumbersCommand {
  readonly jobId: string
  readonly courierId: string
  readonly createdBy: string
  readonly trackingNumber: string
  constructor(props: CreateTrackingNumbersCommand) {
    initialize(this, props)
  }
}
