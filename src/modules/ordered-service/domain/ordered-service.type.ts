import { AssignedTasks } from '@prisma/client'

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
  price: number | null
  projectId: string
  jobId: string
  description: string | null
  isRevision: boolean
  sizeForRevision: OrderedServiceSizeForRevision | null
}

export interface OrderedServiceProps extends CreateOrderedServiceProps {
  priceOverride: number | null
  orderedAt: Date
  status: OrderedServiceStatus
  doneAt: Date | null
  assignedTasks: AssignedTasks[]
  isManualPrice: boolean
}
