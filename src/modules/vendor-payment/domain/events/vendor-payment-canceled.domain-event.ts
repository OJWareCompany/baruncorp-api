import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class VendorPaymentCanceledDomainEvent extends DomainEvent {
  public readonly vendorInvoiceId: string

  constructor(props: DomainEventProps<VendorPaymentCanceledDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
