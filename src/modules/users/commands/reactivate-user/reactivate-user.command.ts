import { initialize } from '../../../../libs/utils/constructor-initializer'

export class ReactivateUserCommand {
  readonly userId: string
  constructor(props: ReactivateUserCommand) {
    initialize(this, props)
  }
}
