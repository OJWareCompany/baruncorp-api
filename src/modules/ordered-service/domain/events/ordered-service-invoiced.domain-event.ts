import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServiceAppliedTieredPricingDomainEvent extends DomainEvent {
  jobId: string

  constructor(props: DomainEventProps<OrderedServiceAppliedTieredPricingDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
