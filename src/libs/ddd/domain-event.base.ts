import { v4 } from 'uuid'

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: string
}

export abstract class DomainEvent {
  public readonly id: string

  /** Aggregate ID where domain event occurred */
  public readonly aggregateId: string

  constructor(props: DomainEventProps<unknown>) {
    this.id = v4()
    this.aggregateId = props.aggregateId
  }
}
