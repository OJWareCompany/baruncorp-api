import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateTaskCommand {
  readonly serviceId: string
  readonly name: string
  constructor(props: CreateTaskCommand) {
    initialize(this, props)
  }
}
