import { initialize } from '../../../../libs/utils/constructor-initializer'
import { TaskPosition } from '../../dtos/task.paginated.response.dto'

export class UpdatePositionOrderCommand {
  readonly taskId: string
  readonly taskPositions: TaskPosition[]
  constructor(props: UpdatePositionOrderCommand) {
    initialize(this, props)
  }
}
