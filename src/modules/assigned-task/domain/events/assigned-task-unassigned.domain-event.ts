import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AssignedTaskUnassignedDomainEvent extends DomainEvent {
  readonly jobId: string
  constructor(props: DomainEventProps<AssignedTaskUnassignedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
