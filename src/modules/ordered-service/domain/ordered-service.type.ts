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
  price: number | null
  projectId: string
  jobId: string
  description: string | null
  isRevision: boolean
  sizeForRevision: OrderedServiceSizeForRevision | null
  projectPropertyType: ProjectPropertyTypeEnum
  mountingType: MountingTypeEnum // TODO: Job의 값이 변경될때 같이 변경되어야함.
  organizationId: string
  organizationName: string
}

export interface OrderedServiceProps extends CreateOrderedServiceProps {
  priceOverride: number | null
  orderedAt: Date
  status: OrderedServiceStatus
  doneAt: Date | null
  assignedTasks: AssignedTasks[]
  isManualPrice: boolean
}
