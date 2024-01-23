import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class OrganizationCreatedDomainEvent extends DomainEvent {
  public readonly userId: string
  constructor(props: DomainEventProps<OrganizationCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
