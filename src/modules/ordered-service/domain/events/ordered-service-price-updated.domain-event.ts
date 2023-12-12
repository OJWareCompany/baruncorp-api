import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServicePriceUpdatedDomainEvent extends DomainEvent {
  readonly jobId: string
  constructor(props: DomainEventProps<OrderedServicePriceUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
