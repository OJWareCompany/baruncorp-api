import { initialize } from '../../../../libs/utils/constructor-initializer'
import { OrderedServiceStatusEnum } from '../../domain/ordered-service.type'

export class UpdateOrderedScopeStatusCommand {
  readonly orderedScopeId: string
  readonly status: OrderedServiceStatusEnum
  readonly editorUserId: string
  constructor(props: UpdateOrderedScopeStatusCommand) {
    initialize(this, props)
  }
}
