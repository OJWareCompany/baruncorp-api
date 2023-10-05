import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { OrderedServiceStatus } from '../../../ordered-service/domain/ordered-service.type'

export interface OrderedServiceProps {
  orderedServiceId: string
  billingCode: string
  basePrice: number
  serviceId: string
  serviceName: string
  jobId: string
  description: string | null
  price: number | null
  priceOverride: number | null
  orderedAt: Date
  status: OrderedServiceStatus
  doneAt: Date | null
  isRevision: boolean
}

export class OrderedService extends ValueObject<OrderedServiceProps> {
  get isRevision(): boolean {
    return this.props.isRevision
  }

  get orderedServiceId(): string {
    return this.props.orderedServiceId
  }

  get basePrice(): number {
    return this.props.basePrice
  }

  get billingCode(): string {
    return this.props.billingCode
  }

  get serviceId(): string {
    return this.props.serviceId
  }

  get serviceName(): string {
    return this.props.serviceName
  }

  get jobId(): string {
    return this.props.jobId
  }

  get description(): string | null {
    return this.props.description
  }

  get price(): number | null {
    return this.props.price
  }

  get priceOverride(): number | null {
    return this.props.priceOverride
  }

  get orderedAt(): Date {
    return this.props.orderedAt
  }

  get status(): OrderedServiceStatus {
    return this.props.status
  }

  get doneAt(): Date | null {
    return this.props.doneAt
  }

  protected validate(props: OrderedServiceProps): void {
    return
  }
}
