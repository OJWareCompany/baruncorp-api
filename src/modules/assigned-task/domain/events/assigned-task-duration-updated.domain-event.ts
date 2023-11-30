import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AssignedTaskDurationUpdatedDomainEvent extends DomainEvent {
  readonly orderedServiceId: string
  constructor(props: DomainEventProps<AssignedTaskDurationUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
