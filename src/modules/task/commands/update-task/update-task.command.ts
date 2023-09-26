import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateTaskCommand {
  readonly taskId: string
  constructor(props: UpdateTaskCommand) {
    initialize(this, props)
  }
}
