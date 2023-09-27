import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServiceCreatedDomainEvent extends DomainEvent {
  readonly jobId: string
  readonly serviceId: string
  readonly orderedAt: Date
  constructor(props: DomainEventProps<OrderedServiceCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
