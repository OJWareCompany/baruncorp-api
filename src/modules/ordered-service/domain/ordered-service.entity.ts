import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateOrderedServiceProps, OrderedServiceProps } from './ordered-service.type'
import { NegativeNumberException, StringIsEmptyException } from '../../../libs/exceptions/exceptions'
import { Guard } from '../../../libs/guard'
import { validateObjectEmptyStringFields } from '../../../libs/utils/validate-object-empty-string-fields'

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

  setDescription(description: string | null): this {
    this.props.description = description
    return this
  }

  public validate(): void {
    return
  }
}
