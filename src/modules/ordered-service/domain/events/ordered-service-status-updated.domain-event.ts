import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServiceStatusUpdatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<OrderedServiceStatusUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
