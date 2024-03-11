import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class JobExpeditedStatusUpdatedDomainEvent extends DomainEvent {
  readonly isExpedited: boolean
  constructor(props: DomainEventProps<JobExpeditedStatusUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
