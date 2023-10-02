import { AssignedTasks } from '@prisma/client'

export type OrderedServiceStatus = 'Pending' | 'Completed' | 'Canceled'
export enum OrderedServiceStatusEnum {
  Pending = 'Pending',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

export interface CreateOrderedServiceProps {
  serviceId: string
  price: number | null
  jobId: string
  description: string | null
}

export interface OrderedServiceProps extends CreateOrderedServiceProps {
  priceOverride: number | null
  orderedAt: Date
  status: OrderedServiceStatus
  doneAt: Date | null
  assignedTasks: AssignedTasks[]
}
