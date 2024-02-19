import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePtoDetailProps, PtoDetailProps } from './pto-detail.type'
import {
  AnnualPtoNotExceedException,
  CanNotBeTakenPTOInOldDateException,
  DateOfJoiningNotFoundException,
  DaysRangeIssueException,
  OverlapsPtoException,
  PaidPtoUpdateException,
  ParentPtoNotFoundException,
} from './pto.error'
import { PtoEntity } from './pto.entity'
import { addDays, subMilliseconds } from 'date-fns'

export class PtoDetailEntity extends AggregateRoot<PtoDetailProps> {
  protected _id: string

  static create(create: CreatePtoDetailProps) {
    const id = v4()
    const props: PtoDetailProps = {
      ...create,
      isPaid: false, //from Pto
      name: '', //from PtoType
      abbreviation: '',
      ownerUserId: '',
      ownerUserDateOfJoining: null,
      parentPtoEntity: null,
    }

    return new PtoDetailEntity({ id, props })
  }

  get startedAt() {
    return this.props.startedAt
  }

  set startedAt(startedAt: Date) {
    this.props.startedAt = startedAt
  }

  get endedAt() {
    return subMilliseconds(addDays(this.startedAt, this.days), 1)
  }

  get days() {
    return this.props.days
  }

  set days(days: number) {
    this.props.days = days
  }

  set ptoTypeId(ptoTypeId: string) {
    this.props.ptoTypeId = ptoTypeId
  }

  set amount(amount: number) {
    this.props.amount = amount
  }

  set parentPtoEntity(parent: PtoEntity) {
    this.props.parentPtoEntity = parent
  }

  get id(): string {
    return this._id
  }

  set id(id: string) {
    this._id = id
  }

  get userId(): string {
    return this.props.userId
  }

  set userId(userId: string) {
    this.props.userId = userId
  }

  get ptoId(): string {
    return this.props.ptoId
  }

  set ptoId(ptoId: string) {
    this.props.ptoId = ptoId
  }

  get currentTenure() {
    return this.calcTenure(this.props.ownerUserDateOfJoining!, this.props.startedAt)
  }

  public validate(): void {
    return
  }

  public checkUpdateValidate(): void {
    // 부모 pto(시즌)을 찾지 못하면 예외
    if (!this.props.parentPtoEntity) {
      throw new ParentPtoNotFoundException()
    }
    // 업데이트를 위해 부모 Pto아래의 details의 에서의 자신을 지우고 validation 진행한다.
    const parentPtoProps = this.props.parentPtoEntity.getProps()

    // 유저의 입사 기념일이 입력되어 있지 않다면 예외
    if (!parentPtoProps.dateOfJoining) {
      throw new DateOfJoiningNotFoundException()
    }
    // 정산 완료 된 경우 예외
    if (parentPtoProps.isPaid) {
      throw new PaidPtoUpdateException()
    }
    // 현재 입사기념일보다 과거 시점에 연차를 추가하려면 예외
    if (this.props.startedAt < parentPtoProps.dateOfJoining) {
      throw new CanNotBeTakenPTOInOldDateException()
    }

    // pto 요청한 날짜 중간에 입사기념일 걸쳤는지 체크
    const startDateTenure: number = this.calcTenure(parentPtoProps.dateOfJoining, this.props.startedAt)
    const endDateTenure: number = this.calcTenure(parentPtoProps.dateOfJoining, this.endedAt)
    if (startDateTenure !== endDateTenure) {
      throw new DaysRangeIssueException()
    }

    this.props.parentPtoEntity.details = parentPtoProps.details!.filter((detail) => {
      return detail.id !== this.id
    })

    // 기존에 설정해놓은 연차 날짜 겹치면 예외 throw
    if (this.props.parentPtoEntity.hasPtoDetailDateInRange(this.props.startedAt, this.props.days)) {
      throw new OverlapsPtoException()
    }
    // 이번 시즌에 사용 가능한 연차 수를 초과하면 예외 처리
    const requestedTotalAmount = this.props.amount * this.props.days
    const usablePtoValue = this.props.parentPtoEntity.getUsablePtoValue()
    if (requestedTotalAmount > usablePtoValue) {
      throw new AnnualPtoNotExceedException()
    }
  }

  private calcTenure(dateOfJoining: Date, targetDate: Date): number {
    const targetDateMilliseconds = targetDate.getTime()
    const userJoiningDateMilliseconds = dateOfJoining.getTime()
    const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000

    const ratioOfYear = (targetDateMilliseconds - userJoiningDateMilliseconds) / oneYearInMilliseconds

    return Math.floor(ratioOfYear + 1)
  }
}
