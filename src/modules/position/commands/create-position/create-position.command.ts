import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreatePositionCommand {
  readonly name: string
  readonly description?: string | null
  readonly maxAssignedTasksLimit: number | null
  constructor(props: CreatePositionCommand) {
    initialize(this, props)
  }
}
