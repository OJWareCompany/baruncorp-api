import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { MountingTypeEnum } from '../../../project/domain/project.type'

export class JobMountingTypeUpdatedDomainEvent extends DomainEvent {
  readonly mountingType: MountingTypeEnum
  constructor(props: DomainEventProps<JobMountingTypeUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
