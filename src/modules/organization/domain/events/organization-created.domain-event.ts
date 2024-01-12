import { initialize } from '../../../../libs/utils/constructor-initializer'
import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'

export class OrganizationCreatedDomainEvent extends DomainEvent {
  readonly name: string
  constructor(props: DomainEventProps<OrganizationCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
