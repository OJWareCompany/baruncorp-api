import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class JobNotStartedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<JobNotStartedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
