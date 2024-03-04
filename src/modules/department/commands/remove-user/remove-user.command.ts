import { initialize } from '../../../../libs/utils/constructor-initializer'

export class RemoveUserCommand {
  readonly userId: string
  readonly departmentId: string

  constructor(props: RemoveUserCommand) {
    initialize(this, props)
  }
}
