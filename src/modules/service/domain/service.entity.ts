import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { Guard } from '../../../libs/guard'
import { StringIsEmptyException } from '../../../libs/exceptions/exceptions'
import { ServiceBillingCodeUpdateException, ServiceNameUpdateException } from './service.error'
import { CreateServiceProps, ServiceProps } from './service.type'
import { Pricing } from './value-objects/pricing.value-object'

export class ServiceEntity extends AggregateRoot<ServiceProps> {
  protected _id: string

  static create(create: CreateServiceProps) {
    const id = v4()
    const props: ServiceProps = {
      ...create,
      tasks: [],
    }
    const entity = new ServiceEntity({ id, props })
    return entity
  }

  get name() {
    return this.props.name
  }

  get pricing() {
    return this.props.pricing
  }

  updateName(name: string): this {
    if (this.props.name === name) return this
    if (Guard.isEmpty(name)) throw new StringIsEmptyException('name')
    if (this.props.tasks.length) throw new ServiceNameUpdateException()
    this.props.name = name
    return this
  }

  updateBillingCode(billingCode: string): this {
    if (this.props.billingCode === billingCode) return this
    if (this.props.tasks.length) throw new ServiceBillingCodeUpdateException()
    if (Guard.isEmpty(billingCode)) throw new StringIsEmptyException('billing code')
    this.props.billingCode = billingCode
    return this
  }

  updateTaskDuration({
    residentialNewEstimatedTaskDuration,
    residentialRevisionEstimatedTaskDuration,
    commercialNewEstimatedTaskDuration,
    commercialRevisionEstimatedTaskDuration,
  }: {
    residentialNewEstimatedTaskDuration: number | null
    residentialRevisionEstimatedTaskDuration: number | null
    commercialNewEstimatedTaskDuration: number | null
    commercialRevisionEstimatedTaskDuration: number | null
  }) {
    this.props.residentialNewEstimatedTaskDuration = residentialNewEstimatedTaskDuration
    this.props.residentialRevisionEstimatedTaskDuration = residentialRevisionEstimatedTaskDuration
    this.props.commercialNewEstimatedTaskDuration = commercialNewEstimatedTaskDuration
    this.props.commercialRevisionEstimatedTaskDuration = commercialRevisionEstimatedTaskDuration
    return this
  }
  updatePricing(pricing: Pricing): this {
    this.props.pricing = pricing
    return this
  }

  public validate(): void {
    Object.entries(this.props).map(([key, value]) => {
      if (typeof value !== 'string') return
      if (Guard.isEmpty(value)) throw new StringIsEmptyException(key)
    })
  }
}
