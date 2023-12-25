import { initialize } from '../../../../libs/utils/constructor-initializer'
import { AutoAssignmentTypeEnum } from '../../../position/domain/position.type'

export class AddAvailableTaskCommand {
  readonly userId: string
  readonly taskId: string
  readonly autoAssignmentType: AutoAssignmentTypeEnum
  constructor(props: AddAvailableTaskCommand) {
    initialize(this, props)
  }
}
