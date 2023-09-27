import { initialize } from '../../../../libs/utils/constructor-initializer'
import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'

export class JobHeldDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<JobHeldDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
