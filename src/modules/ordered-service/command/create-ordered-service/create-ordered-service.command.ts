import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateOrderedServiceCommand {
  readonly serviceId: string
  readonly jobId: string
  readonly description: string | null
  readonly isRevision: boolean
  readonly editorUserId: string

  constructor(props: CreateOrderedServiceCommand) {
    initialize(this, props)
  }
}
