import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { ProjectPropertyTypeEnum } from '../../../project/domain/project.type'

export class JobProjectPropertyTypeUpdatedDomainEvent extends DomainEvent {
  readonly projectPropertyType: ProjectPropertyTypeEnum
  constructor(props: DomainEventProps<JobProjectPropertyTypeUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
