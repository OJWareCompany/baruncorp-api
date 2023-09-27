import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServiceCompletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<OrderedServiceCompletedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
