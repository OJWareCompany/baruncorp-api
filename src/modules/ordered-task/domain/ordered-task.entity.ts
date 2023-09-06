import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateOrderedTaskProps, OrderedTaskProps } from './ordered-task.type'

export class OrderedTaskEntity extends AggregateRoot<OrderedTaskProps> {
  protected _id: string

  static create(create: CreateOrderedTaskProps) {
    const props: OrderedTaskProps = {
      ...create,
      dateCreated: new Date(),
      taskStatus: 'Not Started',
      isLocked: false,
    }
    return new OrderedTaskEntity({ id: v4(), props })
  }

  public validate(): void {
    const result = 1 + 1
  }
}
