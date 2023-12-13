import { DomainEvent, DomainEventProps } from '../../../../libs/ddd/domain-event.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
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
  readonly projectPropertyOwnerName: string
  readonly jobName: string
  constructor(props: DomainEventProps<OrderedServiceCreatedDomainEvent>) {
    super(props)
    initialize(this, props)
  }
}
