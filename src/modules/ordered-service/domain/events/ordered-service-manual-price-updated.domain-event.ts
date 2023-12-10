import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServiceManualPriceUpdatedDomainEvent extends DomainEvent {
  readonly jobId: string
  constructor(props: DomainEventProps<OrderedServiceManualPriceUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
