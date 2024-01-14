import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePtoDetailProps, PtoDetailProps } from './pto-detail.type'
import {
  AnnualPtoNotExceedException,
  DateOfJoiningNotFoundException,
  DaysRangeIssueException,
  OverlapsPtoException,
  PaidPtoUpdateException,
  ParentPtoNotFoundException,
} from './pto.error'
import { PtoEntity } from './pto.entity'

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

  set startedAt(startedAt: Date) {
    this.props.startedAt = startedAt
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
    // pto 요청한 날짜 중간에 입사기념일 걸쳤는지 체크
    const startDateTenure = this.calcTenure(parentPtoProps.dateOfJoining, this.props.startedAt)
    const endDateTenure = this.calcTenure(parentPtoProps.dateOfJoining, this.getEndedAt())
    if (startDateTenure !== endDateTenure) {
      throw new DaysRangeIssueException()
    }

    console.log(`first : ${parentPtoProps.details?.length}`)
    this.props.parentPtoEntity.details = parentPtoProps.details!.filter((detail) => {
      return detail.id !== this.id
    })
    console.log(`second : ${this.props.parentPtoEntity.getProps().details?.length}`)

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

  private getEndedAt(): Date {
    const endedAt: Date = new Date(this.props.startedAt)
    endedAt.setDate(endedAt.getDate() + this.props.days)
    endedAt.setTime(endedAt.getTime() - 1) // 1밀리 초 뺀다.

    return endedAt
  }

  private calcTenure(dateOfJoining: Date, targetDate: Date): number {
    const targetDateMilliseconds = targetDate.getTime()
    const userJoiningDateMilliseconds = dateOfJoining.getTime()
    const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000

    const ratioOfYear = (targetDateMilliseconds - userJoiningDateMilliseconds) / oneYearInMilliseconds

    return Math.floor(ratioOfYear + 1)
  }
}
