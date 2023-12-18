import { initialize } from '../../../../libs/utils/constructor-initializer'
import { AutoAssignmentTypeEnum } from '../../domain/position.type'

export class AddPositionTaskCommand {
  readonly taskId: string
  readonly autoAssignmentType: AutoAssignmentTypeEnum
  constructor(props: AddPositionTaskCommand) {
    initialize(this, props)
  }
}
