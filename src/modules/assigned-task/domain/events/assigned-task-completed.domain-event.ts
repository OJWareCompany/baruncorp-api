import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AssignedTaskCompletedDomainEvent extends DomainEvent {
  readonly orderedServiceId: string
  constructor(props: DomainEventProps<AssignedTaskCompletedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
