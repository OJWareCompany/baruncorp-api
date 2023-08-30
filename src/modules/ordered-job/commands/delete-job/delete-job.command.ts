import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteJobCommand {
  readonly id: string
  constructor(props: DeleteJobCommand) {
    initialize(this, props)
  }
}
