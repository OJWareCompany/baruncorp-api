import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'

/**
 * 원래 정석은 변경된 데이터만 전송하는 것이라고 함
 */
export class AssignedTaskAssignedDomainEvent extends DomainEvent {
  readonly organizationId: string
  readonly jobId: string
  readonly projectPropertyType: ProjectPropertyTypeEnum
  readonly mountingType: MountingTypeEnum
  readonly taskId: string
  readonly taskName: string
  readonly isRevision: boolean
  readonly note: string | null
  readonly assigneeUserId: string
  readonly assigneeName: string
  readonly orderedServiceId: string

  constructor(props: DomainEventProps<AssignedTaskAssignedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
