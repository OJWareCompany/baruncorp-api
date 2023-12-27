import { DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { DomainEvent } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AssignedTaskActivatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<AssignedTaskActivatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
