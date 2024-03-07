import { initialize } from '../../../../libs/utils/constructor-initializer'

export class BackToNotStartedAssignedTaskCommand {
  readonly assignedTaskId: string
  readonly editorUserId: string
  constructor(props: BackToNotStartedAssignedTaskCommand) {
    initialize(this, props)
  }
}
