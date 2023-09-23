import { v4 } from 'uuid'
import { AggregateRoot } from '../../../../libs/ddd/aggregate-root.base'
import { Guard } from '../../../../libs/guard'
import { ServiceBillingCodeUpdateException, ServiceNameUpdateException, StringIsEmptyException } from './service.error'
import { CreateServiceProps, ServiceProps } from './service.type'

export class ServiceEntity extends AggregateRoot<ServiceProps> {
  protected _id: string

  static create(create: CreateServiceProps) {
    const id = v4()
    const props: ServiceProps = { ...create, tasks: [] }
    const entity = new ServiceEntity({ id, props })
    return entity
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

  updateBasePrice(basePrice: number): this {
    this.props.basePrice = basePrice
    return this
  }

  public validate(): void {
    Object.entries(this.props).map(([key, value]) => {
      if (typeof value !== 'string') return
      if (Guard.isEmpty(value)) throw new StringIsEmptyException(key)
    })
  }
}
