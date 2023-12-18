import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeletePositionWorkerCommand {
  readonly positionId: string
  readonly userId: string
  constructor(props: DeletePositionWorkerCommand) {
    initialize(this, props)
  }
}
