import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CancelAssignedTaskCommand {
  readonly assignedTaskId: string
  readonly editorUserId: string
  constructor(props: CancelAssignedTaskCommand) {
    initialize(this, props)
  }
}
