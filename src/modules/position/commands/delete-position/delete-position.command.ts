import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeletePositionCommand {
  readonly positionId: string
  constructor(props: DeletePositionCommand) {
    initialize(this, props)
  }
}
