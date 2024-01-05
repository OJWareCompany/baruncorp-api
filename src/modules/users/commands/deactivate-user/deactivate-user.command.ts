import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeactivateUserCommand {
  readonly userId: string
  constructor(props: DeactivateUserCommand) {
    initialize(this, props)
  }
}
