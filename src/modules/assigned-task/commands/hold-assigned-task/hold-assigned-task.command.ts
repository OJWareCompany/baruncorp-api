import { initialize } from '../../../../libs/utils/constructor-initializer'

export class HoldAssignedTaskCommand {
  readonly assignedTaskId: string
  readonly editorUserId: string
  constructor(props: HoldAssignedTaskCommand) {
    initialize(this, props)
  }
}
