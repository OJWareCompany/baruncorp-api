import { EventEmitter2 } from '@nestjs/event-emitter'
import { DomainEvent } from './domain-event.base'
import { Entity } from './entity.base'
import { Logger } from '@nestjs/common'

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
    // await Promise.all(
    //   this.domainEvents.map(async (event) => {
    //     console.log(`"${event.constructor.name}" event published for aggregate ${this.constructor.name} : ${this.id}`)
    //     return eventEmitter.emitAsync(event.constructor.name, event)
    //   }),
    // )

    // TODO: 동시에 동일한 엔티티에 여러가지 이벤트 핸들러가 실행된다면 동시성 이슈가 생긴다.
    // 따라서 일단 이벤트를 동기적으로 실행. (서비스 취소시 서비스 가격 업데이트, 취소로 업데이트 두가지 이벤트가 발생해서 동시성 이슈 발생했었음)
    for (const event of this.domainEvents) {
      Logger.debug(`"${event.constructor.name}" event published for aggregate ${this.constructor.name} : ${this.id}`)
      await eventEmitter.emitAsync(event.constructor.name, event)
      Logger.debug(`"${event.constructor.name}" event COMPLETED for aggregate ${this.constructor.name} : ${this.id}`)
    }

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
