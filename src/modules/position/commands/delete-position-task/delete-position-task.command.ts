import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeletePositionTaskCommand {
  readonly positionId: string
  readonly taskId: string
  constructor(props: DeletePositionTaskCommand) {
    initialize(this, props)
  }
}
