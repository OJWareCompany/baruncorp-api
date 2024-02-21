import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreditTransactionCreatedDomainEvent extends DomainEvent {
  readonly invoiceId?: string | null
  constructor(props: DomainEventProps<CreditTransactionCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
