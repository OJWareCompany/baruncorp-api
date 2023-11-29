import { initialize } from '../../../../libs/utils/constructor-initializer'
import { OrderedServiceSizeForRevisionEnum } from '../../domain/ordered-service.type'

export class UpdateRevisionSizeCommand {
  readonly orderedServiceId: string
  readonly revisionSize: OrderedServiceSizeForRevisionEnum | null
  constructor(props: UpdateRevisionSizeCommand) {
    initialize(this, props)
  }
}
