import { initialize } from '../../../../libs/utils/constructor-initializer'
import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { Address } from '../../../organization/domain/value-objects/address.vo'

export class ProjectPropertyAddressUpdatedDomainEvent extends DomainEvent {
  projectPropertyAddress: Address

  constructor(props: DomainEventProps<ProjectPropertyAddressUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
