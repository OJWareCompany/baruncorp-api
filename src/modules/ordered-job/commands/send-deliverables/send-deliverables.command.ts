import { initialize } from '../../../../libs/utils/constructor-initializer'

export class SendDeliverablesCommand {
  readonly jobId: string
  readonly editorUserId: string

  constructor(props: SendDeliverablesCommand) {
    initialize(this, props)
  }
}
