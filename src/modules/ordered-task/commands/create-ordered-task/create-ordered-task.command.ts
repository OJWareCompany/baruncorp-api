import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateOrderedTaskCommand {
  jobId: string
  assignedUserId: string | null
  taskMenuId: string
  description: string | null

  constructor(props: CreateOrderedTaskCommand) {
    initialize(this, props)
  }
}
