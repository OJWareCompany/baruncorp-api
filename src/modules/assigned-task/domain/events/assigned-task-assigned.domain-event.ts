import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'

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

  constructor(props: DomainEventProps<AssignedTaskAssignedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
