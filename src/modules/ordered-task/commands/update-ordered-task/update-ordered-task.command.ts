import { initialize } from '../../../../libs/utils/constructor-initializer'
import { TaskStatus } from '../../domain/ordered-task.type'

export class UpdateOrderedTaskCommand {
  orderedTaskId: string
  isLocked: boolean
  taskStatus: TaskStatus
  assigneeUserId: string | null
  description: string | null

  constructor(props: UpdateOrderedTaskCommand) {
    initialize(this, props)
  }
}
