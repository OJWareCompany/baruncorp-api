import { EventEmitter2 } from '@nestjs/event-emitter'
import { DomainEvent } from './domain-event.base'
import { Entity } from './entity.base'

export abstract class AggregateRoot<EntityProps> extends Entity<EntityProps> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  protected addEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
  }

  public clearEvents(): void {
    this._domainEvents = []
  }

  public async publishEvents(eventEmitter: EventEmitter2): Promise<void> {
    await Promise.all(
      this.domainEvents.map(async (event) => {
        console.log(`"${event.constructor.name}" event published for aggregate ${this.constructor.name} : ${this.id}`)
        return eventEmitter.emitAsync(event.constructor.name, event)
      }),
    )
    this.clearEvents()
  }

  public async publishEventByAggregateIdAndThrowIfFailed(
    eventEmitter: EventEmitter2,
    aggregateId: string,
  ): Promise<void> {
    const foundEvent = this.domainEvents.find(function (event) {
      return event.aggregateId === aggregateId
    })
    if (!foundEvent) {
      console.log(`Event does not exist: ${aggregateId}`)
      return
    }
    const results = await eventEmitter.emitAsync(foundEvent.constructor.name, foundEvent)
    results.forEach((result) => {
      if (result && result instanceof Error) {
        throw result
      }
    })
  }
}
