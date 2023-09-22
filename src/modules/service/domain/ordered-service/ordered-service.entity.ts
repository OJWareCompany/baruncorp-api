import { v4 } from 'uuid'
import { AggregateRoot } from '../../../../libs/ddd/aggregate-root.base'
import { CreateOrderedServiceProps, OrderedServiceProps } from './ordered-service.type'

export class OrderedServiceEntity extends AggregateRoot<OrderedServiceProps> {
  protected _id: string

  static create(create: CreateOrderedServiceProps) {
    const id = v4()
    const props: OrderedServiceProps = { ...create, status: null, doneAt: null }
    return new OrderedServiceEntity({ id, props })
  }

  public validate(): void {
    return
  }
}
