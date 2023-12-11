import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AssignedTaskReopenedDomainEvent extends DomainEvent {
  readonly jobId: string
  constructor(props: DomainEventProps<AssignedTaskReopenedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
