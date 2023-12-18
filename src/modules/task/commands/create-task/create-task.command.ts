import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateTaskCommand {
  readonly serviceId: string
  readonly name: string
  readonly isAutoAssignment: boolean
  constructor(props: CreateTaskCommand) {
    initialize(this, props)
  }
}
