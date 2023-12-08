import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import {
  CreateOrderedServiceProps,
  OrderedServiceProps,
  OrderedServiceSizeForRevisionEnum,
} from './ordered-service.type'
import { NegativeNumberException } from '../../../libs/exceptions/exceptions'
import { OrderedServiceCreatedDomainEvent } from './events/ordered-service-created.domain-event'
import { OrderedServiceAlreadyCompletedException } from './ordered-service.error'
import { OrderedServiceCanceledDomainEvent } from './events/ordered-service-canceled.domain-event'
import { OrderedServiceReactivatedDomainEvent } from './events/ordered-service-reactivated.domain-event'
import { OrderedServiceCompletedDomainEvent } from './events/ordered-service-completed.domain-event'
import { Service } from '@prisma/client'
import { OrderedServiceUpdatedRevisionSizeDomainEvent } from './events/ordered-service-updated-revision-size.domain-event'

export class OrderedServiceEntity extends AggregateRoot<OrderedServiceProps> {
  protected _id: string

  static create(create: CreateOrderedServiceProps) {
    const id = v4()
    const props: OrderedServiceProps = {
      ...create,
      priceOverride: null,
      status: 'Pending',
      doneAt: null,
      orderedAt: new Date(),
      isManualPrice: false,
      assignedTasks: [],
    }
    const entity = new OrderedServiceEntity({ id, props })
    entity.addEvent(
      new OrderedServiceCreatedDomainEvent({
        aggregateId: entity.id,
        ...props,
      }),
    )
    return entity
  }

  cancel(): this {
    if (this.props.status === 'Completed') return this
    this.props.status = 'Canceled'
    this.props.doneAt = new Date()
    this.addEvent(
      new OrderedServiceCanceledDomainEvent({
        aggregateId: this.id,
      }),
    )
    return this
  }

  reactivate(): this {
    if (this.props.status === 'Completed') throw new OrderedServiceAlreadyCompletedException()
    this.props.status = 'Pending'
    this.props.doneAt = null
    this.addEvent(
      new OrderedServiceReactivatedDomainEvent({
        aggregateId: this.id,
      }),
    )
    return this
  }

  complete(): this {
    this.props.status = 'Completed'
    this.props.doneAt = new Date()
    this.addEvent(
      new OrderedServiceCompletedDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
    return this
  }

  setTaskSizeForRevision(sizeForRevision: OrderedServiceSizeForRevisionEnum | null): this {
    if (sizeForRevision === OrderedServiceSizeForRevisionEnum.Minor) {
      this.props.price = 0
    }
    this.props.sizeForRevision = this.props.isRevision ? sizeForRevision : null
    this.addEvent(
      new OrderedServiceUpdatedRevisionSizeDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
    return this
  }

  setPrice(price: number | null) {
    if (this.props.isManualPrice) return this
    this.props.price = price
    return this
    // 100원 -> 0원
    // 매뉴얼 -> 자동 무시 -> 들어오는 값이 매뉴얼한 Price인지는 어떻게 판단? 0원도 들어오는데
    // update price를 vo로 만들어서 ismanully라는 속성을 가지고있게 하자?
    // Pricing에 서비스를 넣어서 manully면 거르게 해야한다.

    // api 나누기
    // revision size 변경하는 api
    // update(pricing), manually이면 적용X
    // 가격 업데이트하는 api
    // 무조건 업데이트
    // task에서 시간 입력 api도 필요하다.
  }

  setManualPrice(price: number) {
    this.props.price = price
    this.props.isManualPrice = true
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

  setPriceForCommercialRevision(minutesWorked: number, service: Service): this {
    if (this.props.isManualPrice) return this

    const price = this.calculateCost(
      minutesWorked,
      Number(service.commercialRevisionMinutesPerUnit) + Number.EPSILON,
      Number(service.commercialRevisionCostPerUnit) + Number.EPSILON,
    )
    this.props.price = price
    return this
  }

  calculateCost(minutesWorked: number, minutesPerUnit: number, costPerUnit: number): number {
    // 작업 시간을 단위 시간으로 나누어 필요한 단위의 수를 계산합니다.
    const units: number = minutesWorked / minutesPerUnit

    // 필요한 단위의 수를 반올림하여 총 비용을 계산합니다.
    const totalCost: number = Math.round(units) * costPerUnit

    return totalCost
  }

  public validate(): void {
    return
  }
}
