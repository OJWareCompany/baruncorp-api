import { ServiceEntity } from '../service/service.entity'

export type OrderedServiceStatus = 'Completed' | 'Canceled' | null

export interface CreateOrderedServiceProps {
  service: ServiceEntity
  price: number | null
  jobId: string
  orderedAt: Date
}

export interface OrderedServiceProps {
  service: ServiceEntity
  price: number | null
  jobId: string
  status: OrderedServiceStatus
  orderedAt: Date
  doneAt: Date | null
}
