import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UserJoinedToOrganization extends DomainEvent {
  readonly organizationId: string
  constructor(props: DomainEventProps<UserJoinedToOrganization>) {
    super(props)
    initialize(this, props)
  }
}
