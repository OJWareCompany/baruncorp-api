import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AddUserCommand {
  readonly departmentId: string
  readonly userId: string

  constructor(props: AddUserCommand) {
    initialize(this, props)
  }
}
