import { initialize } from '../../../../libs/utils/constructor-initializer'
import { OrderedServiceStatus } from '../../../ordered-service/domain/ordered-service.type'

export class OrderedServiceValueObject {
  serviceId: string
  serviceName: string
  jobId: string
  description: string | null
  price: number | null
  priceOverride: number | null
  orderedAt: Date
  status: OrderedServiceStatus
  doneAt: Date | null
  // assignedTasks: AssignedTasks[]
  constructor(props: OrderedServiceValueObject) {
    initialize(this, props)
  }
}
