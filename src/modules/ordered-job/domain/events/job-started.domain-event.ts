import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class JobStartedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<JobStartedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
