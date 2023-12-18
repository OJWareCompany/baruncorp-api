import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdatePositionCommand {
  readonly positionId: string
  constructor(props: UpdatePositionCommand) {
    initialize(this, props)
  }
}
