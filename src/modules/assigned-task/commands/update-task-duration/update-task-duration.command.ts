import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateTaskDurationCommand {
  readonly assignedTaskId: string
  readonly duration: number | null
  constructor(props: UpdateTaskDurationCommand) {
    initialize(this, props)
  }
}
