import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'

export class OrderedServiceCanceledDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<OrderedServiceCanceledDomainEvent>) {
    super(props)
  }
}
