import { MountingType } from '../../../project/domain/project.type'
import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { NewOrderedTasks } from '../value-objects/ordered-task.value-object'

/**
 * Entity에서 역할이 다른 로직을 Event를 이용해 분리하고 확장성을 얻는다.
 * - 이벤트 구독/발행
 * - 비동기
 */
export class JobCreatedDomainEvent extends DomainEvent {
  public readonly projectId: string
  public readonly orderedTasks: NewOrderedTasks[]
  public readonly systemSize: number | null
  public readonly mailingAddressForWetStamp: string | null
  public readonly mountingType: MountingType

  constructor(props: DomainEventProps<JobCreatedDomainEvent>) {
    super(props)
    Object.entries(props).map(([key, value]) => (this[key] = value))
  }
}
