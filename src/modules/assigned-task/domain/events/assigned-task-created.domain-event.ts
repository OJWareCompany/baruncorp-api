import { DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { DomainEvent } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AssignedTaskCreatedDomainEvent extends DomainEvent {
  readonly jobId: string
  readonly editorUserId: string | null
  constructor(props: DomainEventProps<AssignedTaskCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
