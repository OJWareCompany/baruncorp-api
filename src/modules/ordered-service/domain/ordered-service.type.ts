import { AssignedTasks } from '@prisma/client'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'

export type OrderedServiceStatus = 'Pending' | 'Completed' | 'Canceled'
export enum OrderedServiceStatusEnum {
  Pending = 'Pending',
  Completed = 'Completed',
  Canceled = 'Canceled',
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
  status: OrderedServiceStatus
  doneAt: Date | null
  assignedTasks: AssignedTasks[]
  isManualPrice: boolean
}
