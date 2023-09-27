import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CancelJobCommand {
  readonly jobId: string
  readonly updatedByUserId: string

  constructor(props: CancelJobCommand) {
    initialize(this, props)
  }
}
