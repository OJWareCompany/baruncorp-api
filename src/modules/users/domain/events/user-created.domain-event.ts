import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UserCreatedDomainEvent extends DomainEvent {
  public readonly userId: string
  public readonly tenure: number
  public readonly total: number

  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
