import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePtoProps, PtoProps } from './pto.type'
import { PtoDetailEntity } from './pto-detail.entity'

export class PtoEntity extends AggregateRoot<PtoProps> {
  protected _id: string
  details: any

  static create(create: CreatePtoProps) {
    const id = v4()
    const props: PtoProps = {
      ...create,
    }

    return new PtoEntity({ id, props })
  }

  public getDateOfJoining(): Date | null | undefined {
    return this.props.dateOfJoining
  }

  public getUsedPtoValue(): number {
    let totalValue = 0
    this.props.details?.forEach((detail) => {
      totalValue += detail.getProps().amount * detail.getProps().days
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

  public addPtoDetail(detail: PtoDetailEntity) {
    if (!this.details) {
      this.details = []
    }
    this.props.details?.push(detail)
  }

  public validate(): void {
    return
  }
}
