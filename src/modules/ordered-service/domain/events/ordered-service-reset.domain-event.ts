import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServiceResetDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<OrderedServiceResetDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
