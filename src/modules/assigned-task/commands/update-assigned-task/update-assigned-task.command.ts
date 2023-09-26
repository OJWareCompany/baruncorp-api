import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateAssignedTaskCommand {
  readonly assignedTaskId: string
  readonly assigneeId: string
  constructor(props: UpdateAssignedTaskCommand) {
    initialize(this, props)
  }
}
