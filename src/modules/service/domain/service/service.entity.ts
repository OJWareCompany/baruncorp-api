import { AggregateRoot } from '../../../../libs/ddd/aggregate-root.base'
import { v4 } from 'uuid'
import { CreateServiceProps, ServiceProps } from './service.type'
import { ServiceBillingCodeUpdateException, ServiceNameUpdateException } from './service.error'

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
    if (this.props.tasks.length) throw new ServiceNameUpdateException()
    this.props.name = name
    return this
  }

  updateBillingCode(billingCode: string): this {
    if (this.props.billingCode === billingCode) return this
    if (this.props.tasks.length) throw new ServiceBillingCodeUpdateException()
    this.props.billingCode = billingCode
    return this
  }

  updateBasePrice(basePrice: number): this {
    this.props.basePrice = basePrice
    return this
  }

  public validate(): void {
    return
  }
}
