import { AssignedTasks } from '@prisma/client'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'

export enum OrderedServiceStatusEnum {
  Not_Started = 'Not Started',
  In_Progress = 'In Progress',
  On_Hold = 'On Hold',
  Canceled = 'Canceled',
  Completed = 'Completed',
  Canceled_Invoice = 'Canceled (Invoice)',
}

export type OrderedServiceSizeForRevision = 'Major' | 'Minor'

export enum OrderedServiceSizeForRevisionEnum {
  Major = 'Major',
  Minor = 'Minor',
}

export interface CreateOrderedServiceProps {
  serviceId: string
  serviceName: string
  isRevision: boolean
  projectId: string
  jobId: string
  description: string | null
  projectPropertyType: ProjectPropertyTypeEnum
  mountingType: MountingTypeEnum // TODO: Job의 값이 변경될때 같이 변경되어야함.
  organizationId: string
  organizationName: string
  projectNumber: string | null
  projectPropertyOwnerName: string | null
  jobName: string
  isExpedited: boolean
}

export interface OrderedServiceProps extends CreateOrderedServiceProps {
  price: number | null
  priceOverride: number | null
  sizeForRevision: OrderedServiceSizeForRevisionEnum | null
  orderedAt: Date
  status: OrderedServiceStatusEnum
  doneAt: Date | null
  assignedTasks: AssignedTasks[]
  isManualPrice: boolean
}
