import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { AssignedTaskAssignedDomainEvent } from './assigned-task-assigned.domain-event'

export class AssignedTaskReopenedDomainEvent extends DomainEvent {
  readonly jobId: string
  constructor(props: DomainEventProps<AssignedTaskAssignedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
