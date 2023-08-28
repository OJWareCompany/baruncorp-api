import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'

export class CurrentJobUpdatedDomainEvent extends DomainEvent {
  public readonly systemSize: number
  public readonly mailingAddressForWetStamp: string
  public readonly projectId: string
  public readonly jobStatus: string

  constructor(props: DomainEventProps<CurrentJobUpdatedDomainEvent>) {
    super(props)
    this.systemSize = props.systemSize
    this.mailingAddressForWetStamp = props.mailingAddressForWetStamp
    this.projectId = props.projectId
    this.jobStatus = props.jobStatus
  }
}
