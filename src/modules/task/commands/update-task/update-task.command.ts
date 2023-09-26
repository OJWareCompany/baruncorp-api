import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateTaskCommand {
  readonly taskId: string
  readonly name: string
  constructor(props: UpdateTaskCommand) {
    initialize(this, props)
  }
}
