import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePtoProps, PtoProps } from './pto.type'
import { PtoDetailEntity } from './pto-detail.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PtoDetail } from './value-objects/pto.detail.vo'

export class PtoEntity extends AggregateRoot<PtoProps> {
  protected _id: string

  static create(create: CreatePtoProps) {
    const id = v4()
    const props: PtoProps = {
      ...create,
      details: null,
      dateOfJoining: null,
    }

    return new PtoEntity({ id, props })
  }

  public getDateOfJoining(): Date | null | undefined {
    return this.props.dateOfJoining
  }

  public getUsedPtoValue(): number {
    let totalValue = 0
    this.props.details?.forEach((detail) => {
      totalValue += detail.amount * detail.days
    })
    return totalValue
  }

  public getUsablePtoValue(): number {
    return this.props.total - this.getUsedPtoValue()
  }

  public getStartedAt(): Date | null {
    if (!this.props.dateOfJoining) return null

    const startedAt: Date = new Date(this.props.dateOfJoining)
    // tenure이 1인 경우는 startedAt이 dateOfJoining이 된다
    startedAt.setFullYear(startedAt.getFullYear() + (this.props.tenure - 1))

    return startedAt
  }

  public getEndedAt(): Date | null {
    const startedAt: Date | null = this.getStartedAt()

    if (!startedAt) return null

    const endedAt: Date = new Date(startedAt)
    // startedAt 으로부터 1년 후
    endedAt.setFullYear(endedAt.getFullYear() + 1)
    // 하루 뺀다
    endedAt.setDate(endedAt.getDate() - 1)

    return endedAt
  }

  public hasPtoDetailDateInRange(startedAt: Date, days: number): boolean {
    if (!this.props.details) return false

    let result = false

    const targetStartedAt = startedAt
    const targetEndedAt = this.makeEndedAt(startedAt, days)
    for (const detail of this.props.details) {
      const detailsStartedAt = detail.startedAt
      const detailsEndedAt: Date = this.makeEndedAt(detail.startedAt, detail.days)
      // 기존의 ptoDetails 영역(detailsStartedAt ~ detailsEndedAt)을 침범한다면 true 반환
      if (!(targetEndedAt < detailsStartedAt || detailsEndedAt < targetStartedAt)) {
        result = true
        break
      }
    }

    return result
  }

  private makeEndedAt(startedAt: Date, days: number): Date {
    const endedAt = new Date(startedAt)
    endedAt.setDate(endedAt.getDate() + days)
    endedAt.setTime(endedAt.getTime() - 1) // 1ms 뺀다

    return endedAt
  }

  set total(total: number) {
    this.props.total = total
  }

  set isPaid(isPaid: boolean) {
    this.props.isPaid = isPaid
  }

  set details(details: PtoDetail[] | null) {
    this.props.details = details
  }

  public validate(): void {
    return
  }
}
