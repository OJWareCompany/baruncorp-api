import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AssignedTaskDeletedDomainEvent extends DomainEvent {
  readonly jobId: string
  readonly deletedAt: Date
  readonly editorUserId: string | null
  constructor(props: DomainEventProps<AssignedTaskDeletedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
