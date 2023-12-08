import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServiceUpdatedRevisionSizeDomainEvent extends DomainEvent {
  readonly jobId: string
  constructor(props: DomainEventProps<OrderedServiceUpdatedRevisionSizeDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
