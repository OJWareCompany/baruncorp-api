import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { OrderedJobsPriorityEnum } from '../value-objects/priority.value-object'

export class JobPriorityUpdatedDomainEvent extends DomainEvent {
  readonly priority: OrderedJobsPriorityEnum
  constructor(props: DomainEventProps<JobPriorityUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
