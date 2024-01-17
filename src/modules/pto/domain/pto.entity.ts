import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePtoProps, PtoProps } from './pto.type'
import { PtoDetailEntity } from './pto-detail.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PtoDetail } from './value-objects/pto.detail.vo'
import { LowerThanUsedPtoException, PaidPtoUpdateException } from './pto.error'

export class PtoEntity extends AggregateRoot<PtoProps> {
  protected _id: string

  static create(create: CreatePtoProps) {
    const id = v4()
    const props: PtoProps = {
      ...create,
      startedAt: null,
      endedAt: null,
      targetUser: null,
      details: null,
    }

    const entity: PtoEntity = new PtoEntity({ id, props })
    entity.renewDateRange()

    return entity
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

  public renewDateRange() {
    this.initStartedAt()
    this.initEndedAt()
  }

  private initStartedAt() {
    if (!this.props.dateOfJoining) return

    const startedAt: Date = new Date(this.props.dateOfJoining)
    // tenure이 1인 경우는 startedAt이 dateOfJoining이 된다
    startedAt.setFullYear(startedAt.getFullYear() + (this.props.tenure - 1))

    this.props.startedAt = startedAt
  }

  private initEndedAt() {
    if (!this.props.startedAt) return

    const endedAt: Date = new Date(this.props.startedAt)
    // startedAt 으로부터 1년 후
    endedAt.setFullYear(endedAt.getFullYear() + 1)
    // 하루 뺀다
    endedAt.setDate(endedAt.getDate() - 1)

    this.props.endedAt = endedAt
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

  public checkUpdateValidate(): void {
    if (this.isPaid) {
      throw new PaidPtoUpdateException()
    }

    const usablePtoValue = this.getUsablePtoValue()
    if (usablePtoValue < 0) {
      // 사용 가능한 연차가 음수 => total 수를 사용한 연차 수보다 작게 업데이트 하려는 경우 등
      throw new LowerThanUsedPtoException()
    }
  }
}
