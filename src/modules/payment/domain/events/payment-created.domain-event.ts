import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class PaymentCreatedDomainEvent extends DomainEvent {
  public readonly invoiceId: string

  constructor(props: DomainEventProps<PaymentCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
