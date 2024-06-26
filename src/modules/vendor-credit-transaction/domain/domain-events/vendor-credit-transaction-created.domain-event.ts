import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class VendorCreditTransactionCreatedDomainEvent extends DomainEvent {
  readonly invoiceId?: string | null
  constructor(props: DomainEventProps<VendorCreditTransactionCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
