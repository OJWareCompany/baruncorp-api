import { MountingType } from '../../../project/domain/project.type'
import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { JobStatus } from '../job.type'

export class CurrentJobUpdatedDomainEvent extends DomainEvent {
  public readonly systemSize: number | null
  public readonly mailingAddressForWetStamp: string | null
  public readonly projectId: string
  public readonly jobStatus: JobStatus
  public readonly mountingType: MountingType
  public readonly isCurrentJop: boolean

  constructor(props: DomainEventProps<CurrentJobUpdatedDomainEvent>) {
    super(props)
    Object.entries(props).map(([key, value]) => (this[key] = value))
  }
}
