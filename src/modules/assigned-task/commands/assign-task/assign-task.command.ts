import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AssignTaskCommand {
  readonly assignedTaskId: string
  readonly assigneeId: string
  constructor(props: AssignTaskCommand) {
    initialize(this, props)
  }
}
