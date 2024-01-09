import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { MountingType } from '../../../project/domain/project.type'
import { JobStatusEnum } from '../job.type'

export class CurrentJobUpdatedDomainEvent extends DomainEvent {
  public readonly systemSize: number | null
  public readonly mailingFullAddressForWetStamp: string | null
  public readonly projectId: string
  public readonly jobStatus: JobStatusEnum
  public readonly mountingType: MountingType
  public readonly isCurrentJop: boolean
  // public readonly assignedTasks: NewOrderedServices[]

  constructor(props: DomainEventProps<CurrentJobUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
