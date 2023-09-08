import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { MountingType } from '../../../project/domain/project.type'
import { OrderedTask } from '../value-objects/ordered-task.value-object'
import { JobStatus } from '../job.type'

export class CurrentJobUpdatedDomainEvent extends DomainEvent {
  public readonly systemSize: number | null
  public readonly mailingFullAddressForWetStamp: string | null
  public readonly projectId: string
  public readonly jobStatus: JobStatus
  public readonly mountingType: MountingType
  public readonly isCurrentJop: boolean
  public readonly orderedTask: OrderedTask[]

  constructor(props: DomainEventProps<CurrentJobUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
