import { initialize } from '../../../../libs/utils/constructor-initializer'
import { AutoAssignmentTypeEnum } from '../../domain/position.type'

export class UpdatePositionTaskAutoAssignmentTypeCommand {
  readonly positionId: string
  readonly taskId: string
  readonly autoAssignmentType: AutoAssignmentTypeEnum
  constructor(props: UpdatePositionTaskAutoAssignmentTypeCommand) {
    initialize(this, props)
  }
}
