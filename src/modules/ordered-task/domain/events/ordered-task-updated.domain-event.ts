import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'

/**
 * Entity에서 역할이 다른 로직을 Event를 이용해 분리하고 확장성을 얻는다.
 * - 이벤트 구독/발행
 * - 비동기
 */
export class OrderedTaskUpdatedDomainEvent extends DomainEvent {
  public readonly jobId: string
  public readonly taskStatus: string

  constructor(props: DomainEventProps<OrderedTaskUpdatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
