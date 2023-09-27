import { initialize } from '../../../../libs/utils/constructor-initializer'

export class HoldJobCommand {
  readonly jobId: string
  readonly updatedByUserId: string

  constructor(props: HoldJobCommand) {
    initialize(this, props)
  }
}
