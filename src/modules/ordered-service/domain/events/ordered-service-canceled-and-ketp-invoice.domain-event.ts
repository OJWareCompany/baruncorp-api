import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServiceCanceledAndKeptInvoiceDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<OrderedServiceCanceledAndKeptInvoiceDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
