import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'

export class OrderedServiceCompletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<OrderedServiceCompletedDomainEvent>) {
    super(props)
  }
}
