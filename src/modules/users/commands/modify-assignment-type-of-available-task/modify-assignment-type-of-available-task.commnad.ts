import { initialize } from '../../../../libs/utils/constructor-initializer'
import { AutoAssignmentTypeEnum } from '../../../position/domain/position.type'

export class ModifyAssignmentTypeOfAvailableTaskCommand {
  readonly userId: string
  readonly taskId: string
  readonly autoAssignmentType: AutoAssignmentTypeEnum
  constructor(props: ModifyAssignmentTypeOfAvailableTaskCommand) {
    initialize(this, props)
  }
}
