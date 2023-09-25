import { v4 } from 'uuid'
import { AggregateRoot } from '../../../../src/libs/ddd/aggregate-root.base'
import { CreateOrderedServiceProps, OrderedServiceProps } from './ordered-service.type'

export class OrderedServiceEntity extends AggregateRoot<OrderedServiceProps> {
  protected _id: string

  static create(create: CreateOrderedServiceProps) {
    const id = v4()
    const props: OrderedServiceProps = {
      ...create,
      price: null,
      priceOverride: null,
      status: null,
      doneAt: null,
      orderedAt: new Date(),
      assignedTasks: [],
    }
    return new OrderedServiceEntity({ id, props })
  }

  public validate(): void {
    return
  }
}
