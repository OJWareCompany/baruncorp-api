import { MountingType } from '@src/modules/project/domain/project.type'
import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { JobStatus } from '../job.type'

export class CurrentJobUpdatedDomainEvent extends DomainEvent {
  public readonly systemSize: number
  public readonly mailingAddressForWetStamp: string
  public readonly projectId: string
  public readonly jobStatus: JobStatus
  public readonly mountingType: MountingType

  constructor(props: DomainEventProps<CurrentJobUpdatedDomainEvent>) {
    super(props)
    this.systemSize = props.systemSize
    this.mailingAddressForWetStamp = props.mailingAddressForWetStamp
    this.projectId = props.projectId
    this.jobStatus = props.jobStatus
    this.mountingType = props.mountingType
  }
}
