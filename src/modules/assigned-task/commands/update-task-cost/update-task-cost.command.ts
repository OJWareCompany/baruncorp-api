import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateTaskCostCommand {
  readonly assignedTaskId: string
  readonly cost: number | null
  constructor(props: UpdateTaskCostCommand) {
    initialize(this, props)
  }
}
