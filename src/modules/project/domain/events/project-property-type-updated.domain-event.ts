import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { ProjectPropertyTypeEnum } from '../project.type'

export class ProjectPropertyTypeUpdatedDomainEvent extends DomainEvent {
  readonly projectPropertyType: ProjectPropertyTypeEnum
  readonly systemSize: number | null
  constructor(props: DomainEventProps<ProjectPropertyTypeUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
