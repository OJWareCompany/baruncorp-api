import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Priority } from '../../../ordered-job/domain/value-objects/priority.value-object'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'

export class OrderedServiceCreatedDomainEvent extends DomainEvent {
  readonly serviceId: string
  readonly serviceName: string
  readonly projectId: string
  readonly jobId: string
  readonly organizationId: string
  readonly organizationName: string
  readonly projectPropertyType: ProjectPropertyTypeEnum
  readonly mountingType: MountingTypeEnum
  readonly description: string | null
  readonly orderedAt: Date
  readonly isRevision: boolean
  readonly projectNumber: string | null
  readonly projectPropertyOwnerName: string | null
  readonly jobName: string
  readonly isExpedited: boolean
  readonly priority: Priority
  readonly editorUserId: string | null

  constructor(props: DomainEventProps<OrderedServiceCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
