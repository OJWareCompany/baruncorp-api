import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AssignedTaskAssignedDomainEvent extends DomainEvent {
  readonly jobId: string
  constructor(props: DomainEventProps<AssignedTaskAssignedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
