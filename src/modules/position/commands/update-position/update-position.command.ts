import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdatePositionCommand {
  readonly positionId: string
  readonly name: string
  readonly description?: string | null
  readonly maxAssignedTasksLimit: number | null
  constructor(props: UpdatePositionCommand) {
    initialize(this, props)
  }
}
