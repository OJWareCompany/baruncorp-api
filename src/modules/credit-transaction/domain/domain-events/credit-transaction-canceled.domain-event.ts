import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreditTransactionCanceledDomainEvent extends DomainEvent {
  readonly invoiceId?: string | null
  constructor(props: DomainEventProps<CreditTransactionCanceledDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
