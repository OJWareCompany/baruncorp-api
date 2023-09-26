import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteTaskCommand {
  readonly taskId: string
  constructor(props: DeleteTaskCommand) {
    initialize(this, props)
  }
}
