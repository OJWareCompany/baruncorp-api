import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class InvoiceCreatedDomainEvent extends DomainEvent {
  readonly clientOrganizationId: string
  readonly serviceMonth: Date
  constructor(props: DomainEventProps<InvoiceCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
