import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServiceBackToNotStartedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<OrderedServiceBackToNotStartedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
