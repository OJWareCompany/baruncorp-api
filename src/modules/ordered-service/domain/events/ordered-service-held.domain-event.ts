import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServiceHeldDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<OrderedServiceHeldDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
