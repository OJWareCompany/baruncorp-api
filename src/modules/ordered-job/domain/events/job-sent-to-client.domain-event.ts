import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class JobSentToClientDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<JobSentToClientDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
