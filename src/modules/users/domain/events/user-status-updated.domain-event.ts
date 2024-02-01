import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { UserStatusEnum } from '@modules/users/domain/user.types'

export class UserStatusUpdatedDomainEvent extends DomainEvent {
  public readonly status: UserStatusEnum
  public readonly email: string

  constructor(props: DomainEventProps<UserStatusUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
