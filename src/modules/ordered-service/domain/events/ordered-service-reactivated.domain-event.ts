import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServiceReactivatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<OrderedServiceReactivatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
