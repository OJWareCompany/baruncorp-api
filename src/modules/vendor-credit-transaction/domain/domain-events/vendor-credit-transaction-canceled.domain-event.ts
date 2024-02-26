import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class VendorCreditTransactionCanceledDomainEvent extends DomainEvent {
  readonly vendorInvoiceId?: string | null
  constructor(props: DomainEventProps<VendorCreditTransactionCanceledDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
