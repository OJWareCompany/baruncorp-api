import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateTaskDurationCommand {
  readonly assignedTaskId: string
  readonly duration: number | null
  readonly editorUserId: string
  constructor(props: UpdateTaskDurationCommand) {
    initialize(this, props)
  }
}
