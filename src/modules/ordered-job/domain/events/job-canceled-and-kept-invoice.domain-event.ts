import { initialize } from '../../../../libs/utils/constructor-initializer'
import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'

export class JobCanceledAndKeptInvoiceDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<JobCanceledAndKeptInvoiceDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
