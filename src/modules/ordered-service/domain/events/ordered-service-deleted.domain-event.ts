import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrderedServiceDeletedDomainEvent extends DomainEvent {
  readonly jobId: string
  readonly deletedAt: Date
  readonly editorUserId: string | null
  constructor(props: DomainEventProps<OrderedServiceDeletedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
