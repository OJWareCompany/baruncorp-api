import { DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { DomainEvent } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AssignedTaskCreatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<AssignedTaskCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
