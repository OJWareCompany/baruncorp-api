import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AddPositionWorkerCommand {
  readonly positionId: string
  readonly userId: string
  constructor(props: AddPositionWorkerCommand) {
    initialize(this, props)
  }
}
