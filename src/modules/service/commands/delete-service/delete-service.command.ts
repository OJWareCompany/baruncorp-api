import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteServiceCommand {
  readonly serviceId: string
  constructor(props: DeleteServiceCommand) {
    initialize(this, props)
  }
}
