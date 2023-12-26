import { initialize } from '../../../../libs/utils/constructor-initializer'

export class ResetDefaultTasksCommand {
  readonly userId: string
  constructor(props: ResetDefaultTasksCommand) {
    initialize(this, props)
  }
}
