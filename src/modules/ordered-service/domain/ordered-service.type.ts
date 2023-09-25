import { AssignedTasks } from '@prisma/client'

export type OrderedServiceStatus = 'Completed' | 'Canceled' | null
export enum OrderedServiceStatusEnum {
  Completed = 'Completed',
  Canceled = 'Canceled',
}

export interface CreateOrderedServiceProps {
  serviceId: string
  jobId: string
}

export interface OrderedServiceProps {
  serviceId: string
  price: number | null
  priceOverride: number | null
  jobId: string
  orderedAt: Date
  status: OrderedServiceStatus
  doneAt: Date | null
  assignedTasks: AssignedTasks[]
}
