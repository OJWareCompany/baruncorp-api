import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'

/**
 * Entity에서 역할이 다른 로직을 Event를 이용해 분리하고 확장성을 얻는다.
 * - 이벤트 구독/발행
 * - 비동기
 */
export class JobCreatedDomainEvent extends DomainEvent {
  public readonly projectId: string
  public readonly orderedTasks: { taskId: string; description: string | null }[]
  public readonly systemSize: number
  public readonly mailingAddressForWetStamp: string

  constructor(props: DomainEventProps<JobCreatedDomainEvent>) {
    super(props)
    this.orderedTasks = props.orderedTasks
    this.projectId = props.projectId // props로 안하면 생성자에서 초기화 안해줬을때 문제 됨
    this.systemSize = props.systemSize
    this.mailingAddressForWetStamp = props.mailingAddressForWetStamp
  }
}
