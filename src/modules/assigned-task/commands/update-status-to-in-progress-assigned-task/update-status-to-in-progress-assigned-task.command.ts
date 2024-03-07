import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateStatusToInProgressAssignedTaskCommand {
  readonly assignedTaskId: string
  readonly editorUserId: string
  constructor(props: UpdateStatusToInProgressAssignedTaskCommand) {
    initialize(this, props)
  }
}
