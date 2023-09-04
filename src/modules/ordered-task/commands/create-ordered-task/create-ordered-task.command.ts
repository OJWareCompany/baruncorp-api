import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateOrderedTaskCommand {
  taskMenuId: string
  jobId: string
  assignedUserId: string | null
  description: string | null

  constructor(props: CreateOrderedTaskCommand) {
    initialize(this, props)
  }
}
