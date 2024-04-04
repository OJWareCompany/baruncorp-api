import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CustomPricingDeletedDomainEvent extends DomainEvent {
  readonly organizationId: string
  constructor(props: DomainEventProps<CustomPricingDeletedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
