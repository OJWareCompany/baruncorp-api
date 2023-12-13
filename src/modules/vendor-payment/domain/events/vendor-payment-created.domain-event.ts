import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class VendorPaymentCreatedDomainEvent extends DomainEvent {
  public readonly vendorInvoiceId: string

  constructor(props: DomainEventProps<VendorPaymentCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
