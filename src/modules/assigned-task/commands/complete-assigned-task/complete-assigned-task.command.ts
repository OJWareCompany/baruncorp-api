import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CompleteAssignedTaskCommand {
  readonly assignedTaskId: string
  readonly editorUserId: string
  constructor(props: CompleteAssignedTaskCommand) {
    initialize(this, props)
  }
}
