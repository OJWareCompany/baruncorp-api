import { initialize } from '../../../../libs/utils/constructor-initializer'
import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'

export class JobCanceledDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<JobCanceledDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
