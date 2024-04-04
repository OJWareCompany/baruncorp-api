import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CustomPricingCreatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<CustomPricingCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
