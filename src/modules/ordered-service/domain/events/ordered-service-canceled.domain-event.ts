import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServiceCanceledDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<OrderedServiceCanceledDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
