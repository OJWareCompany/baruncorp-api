import { initialize } from '../../../../libs/utils/constructor-initializer'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { Address } from '../../../organization/domain/value-objects/address.vo'
import { NewOrderedServices } from '../value-objects/assigned-task.value-object'

/**
 * Entity에서 역할이 다른 로직을 Event를 이용해 분리하고 확장성을 얻는다.
 * - 이벤트 구독/발행
 * - 비동기
 */
export class JobCreatedDomainEvent extends DomainEvent {
  readonly projectId: string
  readonly services: NewOrderedServices[]
  readonly systemSize: number | null
  readonly mailingAddressForWetStamp: Address | null
  readonly organizationId: string
  readonly organizationName: string
  readonly mountingType: MountingTypeEnum
  readonly projectType: ProjectPropertyTypeEnum
  readonly editorUserId: string | null

  constructor(props: DomainEventProps<JobCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
