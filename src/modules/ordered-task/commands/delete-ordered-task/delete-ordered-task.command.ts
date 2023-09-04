import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteOrderedTaskCommand {
  readonly id: string
  constructor(props: DeleteOrderedTaskCommand) {
    initialize(this, props)
  }
}
