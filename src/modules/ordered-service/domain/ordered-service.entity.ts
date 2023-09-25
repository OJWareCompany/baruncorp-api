import { v4 } from 'uuid'
import { AggregateRoot } from '../../../../src/libs/ddd/aggregate-root.base'
import { CreateOrderedServiceProps, OrderedServiceProps } from './ordered-service.type'
import { NegativeNumberException } from '../../../libs/exceptions/exceptions'

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

  setPriceOverride(priceOverride: number | null): this {
    if (typeof priceOverride === 'number' && priceOverride < 0) throw new NegativeNumberException()
    this.props.priceOverride = priceOverride
    return this
  }

  public validate(): void {
    return
  }
}
