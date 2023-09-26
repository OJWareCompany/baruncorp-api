import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateOrderedServiceProps, OrderedServiceProps } from './ordered-service.type'
import { NegativeNumberException } from '../../../libs/exceptions/exceptions'
import { OrderedServiceCreatedDomainEvent } from './events/ordered-service-created.domain-event'

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
    const entity = new OrderedServiceEntity({ id, props })
    entity.addEvent(
      new OrderedServiceCreatedDomainEvent({
        aggregateId: entity.id,
        serviceId: props.serviceId,
        jobId: props.jobId,
        orderedAt: props.orderedAt,
      }),
    )
    return entity
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
