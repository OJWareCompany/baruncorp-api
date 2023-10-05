import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class PaymentCanceledDomainEvent extends DomainEvent {
  public readonly invoiceId: string

  constructor(props: DomainEventProps<PaymentCanceledDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
