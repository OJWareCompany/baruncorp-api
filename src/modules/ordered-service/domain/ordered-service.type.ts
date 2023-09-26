import { AssignedTasks } from '@prisma/client'

export type OrderedServiceStatus = 'Completed' | 'Canceled' | null
export enum OrderedServiceStatusEnum {
  Completed = 'Completed',
  Canceled = 'Canceled',
}

export interface CreateOrderedServiceProps {
  serviceId: string
  jobId: string
  description: string | null
}

export interface OrderedServiceProps extends CreateOrderedServiceProps {
  price: number | null
  priceOverride: number | null
  orderedAt: Date
  status: OrderedServiceStatus
  doneAt: Date | null
  assignedTasks: AssignedTasks[]
}
