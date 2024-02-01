import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UserDateOfJoiningUpdatedDomainEvent extends DomainEvent {
  public readonly dateOfJoining: Date | null

  constructor(props: DomainEventProps<UserDateOfJoiningUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
