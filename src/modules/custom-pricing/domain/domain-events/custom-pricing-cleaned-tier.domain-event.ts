import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CustomPricingCleanedTierDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<CustomPricingCleanedTierDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
