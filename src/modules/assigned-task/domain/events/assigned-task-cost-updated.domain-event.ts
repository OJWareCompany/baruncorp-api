import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AssignedTaskCostUpdatedDomainEvent extends DomainEvent {
  readonly cost: number
  constructor(props: DomainEventProps<AssignedTaskCostUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
