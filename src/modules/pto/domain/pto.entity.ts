import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePtoProps, PtoProps } from './pto.type'
import { PtoDetailEntity } from './pto-detail.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PtoDetail } from './value-objects/pto.detail.vo'
import { LowerThanUsedPtoException, PaidPtoUpdateException } from './pto.error'
import { addDays, addYears, subDays, subMilliseconds } from 'date-fns'

export class PtoEntity extends AggregateRoot<PtoProps> {
  protected _id: string

  static create(create: CreatePtoProps) {
    const id = v4()
    const props: PtoProps = {
      ...create,
      targetUser: null,
      details: [],
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

  public renewDateRange() {
    const startedAt: Date = new Date(this.props.dateOfJoining)
    this.props.startedAt = addYears(startedAt, this.tenure - 1)
    this.props.endedAt = subDays(addYears(this.props.startedAt, 1), 1)
  }

  public hasPtoDetailDateInRange(startedAt: Date, days: number): boolean {
    if (!this.props.details) return false

    let result = false

    const targetStartedAt = startedAt
    const targetEndedAt = subMilliseconds(addDays(startedAt, days), 1)
    for (const detail of this.props.details) {
      const detailsStartedAt = detail.startedAt
      // 하루 더하고 1 밀리 세컨드(ms) 뺀다
      const detailsEndedAt: Date = subMilliseconds(addDays(detail.startedAt, detail.days), 1)
      // 기존의 ptoDetails 영역(detailsStartedAt ~ detailsEndedAt)을 침범한다면 true 반환
      if (!(targetEndedAt < detailsStartedAt || detailsEndedAt < targetStartedAt)) {
        result = true
        break
      }
    }

    return result
  }

  get userId() {
    return this.props.userId
  }

  get startedAt() {
    return this.props.startedAt
  }

  set startedAt(startedAt: Date) {
    this.props.startedAt = startedAt
  }

  get endedAt() {
    return this.props.endedAt
  }

  set endedAt(endedAt: Date) {
    this.props.endedAt = endedAt
  }

  get total() {
    return this.props.total
  }

  set total(total: number) {
    this.props.total = total
  }

  get tenure() {
    return this.props.tenure
  }

  set tenure(tenure: number) {
    this.props.tenure = tenure
  }

  set isPaid(isPaid: boolean) {
    this.props.isPaid = isPaid
  }

  get details(): PtoDetail[] {
    return this.props.details
  }

  set details(details: PtoDetail[]) {
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
