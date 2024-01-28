import { initialize } from '../../../../libs/utils/constructor-initializer'

export class RejectAssignedTaskCommand {
  readonly assignedTaskId: string
  readonly reason: string
  readonly userId: string
  readonly editorUserId: string
  constructor(props: RejectAssignedTaskCommand) {
    initialize(this, props)
  }
}
