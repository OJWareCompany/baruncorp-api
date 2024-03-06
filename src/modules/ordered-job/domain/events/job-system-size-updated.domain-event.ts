import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class JobSystemSizeUpdatedDomainEvent extends DomainEvent {
  readonly systemSize: number
  constructor(props: DomainEventProps<JobSystemSizeUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
