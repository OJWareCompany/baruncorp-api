import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteExpensePricingCommand {
  readonly organizationId: string
  readonly taskId: string
  constructor(props: DeleteExpensePricingCommand) {
    initialize(this, props)
  }
}
